import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseUser, Seat, SeatMap, SeatMapsService, UserState } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { combineLatest, distinctUntilChanged, of, Subject } from 'rxjs';
import { debounceTime, filter, map, share, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { SeatComponent } from './components/seat/seat.component';

interface StatusOption {
  label: string;
  value: UserState;
  className: string;
}

@Component({
  selector: 'hcm-seat-maps',
  templateUrl: './seat-maps.component.html',
  styleUrls: ['./seat-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class SeatMapsComponent implements OnInit, AfterViewInit {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  readonly seatMapControl = new FormControl();
  readonly allSeatMaps$ = this.seatMapsService.seatMaps$;
  readonly statusesAnnotate: { key: keyof SeatMap; className: string; label: string }[] = [
    { key: 'countCheckedIn', className: 'checked-in', label: 'checkedIn' },
    { key: 'countCheckedInLate', className: 'checked-in-late', label: 'checkedInLate' },
    { key: 'countCheckoutEarly', className: 'checked-out-early', label: 'checkedOutEarly' },
    { key: 'countCheckedOut', className: 'checked-out', label: 'checkedOut' },
    { key: 'countLeave', className: 'leave', label: 'leave' },
    { key: 'countWorkingOutsite', className: 'working-onsite', label: 'workingOnsite' },
    { key: 'countWfh', className: 'work-from-home', label: 'workFromHome' },
    { key: 'countNotCheckIn', className: 'not-checked-in', label: 'notCheckedIn' },
  ];
  readonly statusList: ReadonlyArray<StatusOption> = [
    { value: UserState['checked-in'], className: 'checked-in', label: 'checkedIn' },
    { value: UserState['checked-in-late'], className: 'checked-in-late', label: 'checkedInLate' },
    { value: UserState['checked-out-early'], className: 'checked-out-early', label: 'checkedOutEarly' },
    { value: UserState['checked-out'], className: 'checked-out', label: 'checkedOut' },
    { value: UserState.leave, className: 'leave', label: 'leave' },
    { value: UserState['working-onsite'], className: 'working-onsite', label: 'workingOnsite' },
    { value: UserState['work-from-home'], className: 'work-from-home', label: 'workFromHome' },
    { value: UserState['not-checked-in'], className: 'not-checked-in', label: 'notCheckedIn' },
  ];
  httpParams = new HttpParams();
  status: StatusOption | null = null;
  userControl = new FormControl();
  readonly searchAssignedUser$ = new Subject<string | null>();
  readonly assignedUsers$ = this.searchAssignedUser$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => (search ? this.seatMapsService.getSeatAssignedUsers(search) : of([]))),
    startWith([]),
    share()
  );
  // READS
  readonly loading$ = this.state.select('loading');
  readonly seatMap$ = this.state.select('seatMapData');
  // EVENTS
  readonly assignUserToSeat$ = new Subject<Seat>();
  readonly filterType$ = new Subject<string | null>();
  readonly status$ = new Subject<void>();
  readonly fetch$ = new Subject<void>();
  // HANDLERS
  readonly assignUserToSeatHandler$ = this.assignUserToSeat$.pipe(
    switchMap((payload) => this.seatMapsService.assignUserForSeat(payload.id, payload)),
    tap(() => this.fetch$.next())
  );
  // SIDE EFFECTS
  readonly changeSeatMapSideEffect$ = this.seatMapControl.valueChanges.pipe(
    filter(isPresent),
    tap((seatMap) => this.router.navigate(['/seat-maps', seatMap.id]))
  );
  readonly selectAssignedUsers$ = this.userControl.valueChanges.pipe(
    filter(isPresent),
    switchMap((user: BaseUser) => this.seatMapsService.getSeatByUserId(user.id)),
    tap((seatMapId) => this.router.navigate(['/seat-maps', seatMapId]))
  );
  readonly seatMapIdChanges$ = this.activatedRoute.params.pipe(
    map((params) => params['seatMapId']),
    distinctUntilChanged()
  );
  private readonly request$ = combineLatest([this.seatMapIdChanges$, this.fetch$]).pipe(
    switchMap(([seatMapId]) =>
      this.seatMapsService.getSeatMap(seatMapId, this.httpParams).pipe(
        tap((seatMap) =>
          this.state.set('loading', () => seatMap && seatMap?.imageUrl !== this.state.get('seatMapData', 'imageUrl'))
        ),
        startWith(null)
      )
    ),
    share()
  );

  constructor(
    private readonly seatMapsService: SeatMapsService,
    private readonly state: RxState<{ seatMapData: SeatMap; loading: boolean }>,
    private readonly router: Router,
    private readonly destroy$: TuiDestroyService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    seatMapsService.doLoadSeatMaps();
    state.connect('seatMapData', this.request$.pipe(filter(isPresent)));
    state.hold(
      this.request$.pipe(
        filter(isPresent),
        take(1),
        tap((seatMap) => {
          if (seatMap.id) {
            this.seatMapControl.setValue(seatMap, { emitEvent: false });
          }
        })
      )
    );
    state.hold(this.assignUserToSeatHandler$);
    state.hold(this.filterType$, (filterType) => {
      this.onFilter('filterType', filterType);
      this.fetch$.next();
    });
    state.hold(this.status$, () => {
      this.onFilter('status', this.status?.value || null);
      this.fetch$.next();
    });
    state.hold(this.changeSeatMapSideEffect$);
    state.hold(this.selectAssignedUsers$);
    state.hold(this.seatMapIdChanges$);
  }

  readonly stringify: TuiStringHandler<BaseUser> = ({ name }) => name;

  ngOnInit(): void {
    combineLatest([this.allSeatMaps$, this.seatMapIdChanges$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([seatMaps, seatMapId]) => {
        const currentSeatMap = seatMaps.find((seatMap) => seatMap.id === seatMapId);

        this.seatMapControl.setValue(currentSeatMap || null, { emitEvent: false });
      });

    const status = this.activatedRoute.snapshot.queryParams['status'];
    const filterType = this.activatedRoute.snapshot.queryParams['filterType'];

    if (status) {
      this.status = this.statusList.find((option) => option.value === Number(status)) || null;
      this.onFilter('status', this.status?.value || null);
    }
    this.onFilter('filterType', filterType);
    this.fetch$.next();
  }

  ngAfterViewInit(): void {
    combineLatest([this.seatRefs.changes, this.userControl.valueChanges.pipe(filter(isPresent))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([seatRefs, user]: [QueryList<SeatComponent>, BaseUser]) => {
        const node: Element | undefined = seatRefs.find((seatRef) => seatRef.seat.assignedUser?.id === user?.id)
          ?.elementRef?.nativeElement;

        node?.scrollIntoView({ block: 'center', inline: 'center' });
      });
  }

  readonly identityMatcher: TuiIdentityMatcher<SeatMap | string> = (item1, item2) =>
    (item1 as SeatMap).id === (item2 as SeatMap).id;
  readonly statusIdentityMatcher: TuiIdentityMatcher<StatusOption> = (item1, item2) => item1.value === item2.value;

  onFilter(key: 'filterType' | 'status', value: number | string | null): void {
    this.httpParams = value ? this.httpParams.set(key, value) : this.httpParams.delete(key);
  }

  onSelectStatus(status: StatusOption): void {
    this.status = status;
    this.status$.next();
    this.router.navigate([], {
      queryParams: { status: status?.value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onAssignUserToSeat(seat: Seat): void {
    this.assignUserToSeat$.next(seat);
  }

  onUnAssignUserToSeat(id: string): void {
    this.assignUserToSeat$.next({ id, seatStatus: 0 } as Seat);
  }

  onImageLoad(): void {
    this.state.set('loading', () => false);
  }
}
