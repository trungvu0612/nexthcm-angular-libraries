import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseUser, Seat, SeatMap, SeatMapsService, UserState } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, distinctUntilChanged, of, Subject } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

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
  providers: [RxState],
})
export class SeatMapsComponent implements OnInit, AfterViewInit {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  readonly seatMapControl = new UntypedFormControl();
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
  userControl = new UntypedFormControl();
  readonly searchAssignedUser$ = new Subject<string | null>();
  readonly assignedUsers$ = this.searchAssignedUser$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => (search ? this.seatMapsService.getSeatAssignedUsers(search) : of([]))),
    startWith([])
  );

  readonly assignUserToSeat$ = new Subject<Seat>();
  readonly filterType$ = new Subject<string | null>();
  readonly status$ = new Subject<void>();
  readonly fetch$ = new Subject<void>();

  readonly loading$ = new BehaviorSubject<{ imageUrl: string; loading: boolean }>({ imageUrl: '', loading: true });
  readonly seatMap$ = combineLatest([
    this.activatedRoute.params.pipe(map((params) => params['seatMapId'])),
    this.allSeatMaps$,
    this.fetch$.pipe(startWith(null)),
  ]).pipe(
    switchMap(([seatMapId, seatMaps]) => {
      this.seatMapControl.setValue(seatMaps.find((seatMap) => seatMap.id === seatMapId) || null, { emitEvent: false });
      this.loading$.next({ ...this.loading$.value, loading: true });
      return this.seatMapsService.getSeatMap(seatMapId, this.httpParams);
    }),
    tap((seatMap) => {
      if (seatMap.id) {
        if (!this.seatMapControl.value) this.seatMapControl.setValue(seatMap, { emitEvent: false });
        if (this.loading$.value.imageUrl === seatMap.imageUrl) {
          this.loading$.next({ ...this.loading$.value, loading: false });
        }
      } else this.loading$.next({ imageUrl: '', loading: false });
    })
  );

  constructor(
    private readonly seatMapsService: SeatMapsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly state: RxState<Record<string, never>>
  ) {
    seatMapsService.doLoadSeatMaps();
    state.hold(this.filterType$, (filterType) => {
      this.onFilter('filterType', filterType);
      this.fetch$.next();
    });
    state.hold(this.status$, () => {
      this.onFilter('status', this.status?.value || null);
      this.fetch$.next();
    });
    state.hold(
      this.assignUserToSeat$.pipe(switchMap((payload) => this.seatMapsService.assignUserForSeat(payload.id, payload))),
      () => this.fetch$.next()
    );
    state.hold(this.seatMapControl.valueChanges.pipe(filter(isPresent)), (seatMap) =>
      this.router.navigate(['/seat-maps', seatMap.id])
    );
    state.hold(
      this.userControl.valueChanges.pipe(
        filter(isPresent),
        switchMap((user: BaseUser) => this.seatMapsService.getSeatByUserId(user.id))
      ),
      (seatMapId) => this.router.navigate(['/seat-maps', seatMapId])
    );
  }

  ngOnInit(): void {
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
    this.state.hold(
      combineLatest([this.seatRefs.changes, this.userControl.valueChanges.pipe(filter(isPresent))]),
      ([seatRefs, user]: [QueryList<SeatComponent>, BaseUser]) => {
        seatRefs
          .find((seatRef) => seatRef.seat.assignedUser?.id === user?.id)
          ?.elementRef?.nativeElement?.scrollIntoView({ block: 'center', inline: 'center' });
      }
    );
  }

  readonly stringify: TuiStringHandler<BaseUser> = ({ name }) => name;
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
}
