import { CdkDragStart } from '@angular/cdk/drag-drop';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { BaseUser, loadSeatMaps, Seat, SeatMap, SeatMapsQuery, UserState } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { combineLatest, distinctUntilChanged, of, Subject } from 'rxjs';
import { debounceTime, filter, share, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { SeatComponent } from './components/seat/seat.component';
import { SeatMapsService } from './seat-maps.service';

const getLabel: Record<string, string> = {
  MY_TEAM: 'myTeam',
};

interface ComponentState {
  seatMapData: SeatMap;
  loading: boolean;
}

interface StatusAnnotate {
  key: keyof SeatMap;
  className: string;
  label: string;
}

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
  readonly dragging$ = new Subject<boolean>();
  readonly seatMapControl = new FormControl();
  readonly allSeatMaps$ = this.seatMapsQuery.selectAll();
  readonly statusesAnnotate: StatusAnnotate[] = [
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
    tap(() => this.seatMapControl.setValue(this.seatMapControl.value))
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
  readonly seatMapIdChanges$ = this.routerQuery.selectParams<string>('seatMapId');
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
    private readonly state: RxState<ComponentState>,
    private readonly router: Router,
    private readonly destroy$: TuiDestroyService,
    private readonly routerQuery: RouterQuery,
    private readonly seatMapsQuery: SeatMapsQuery,
    actions: Actions
  ) {
    actions.dispatch(loadSeatMaps());
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

  readonly stringify: TuiStringHandler<any> = (item: BaseUser) => item.name;

  ngOnInit(): void {
    combineLatest([this.allSeatMaps$, this.seatMapIdChanges$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([seatMaps, seatMapId]) => {
        const currentSeatMap = seatMaps.find((seatMap) => seatMap.id === seatMapId);

        this.seatMapControl.setValue(currentSeatMap || null, { emitEvent: false });
      });

    const status = this.routerQuery.getQueryParams<string>('status');
    const filterType = this.routerQuery.getQueryParams<string>('filterType');

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
  readonly statusIdentityMatcher: TuiIdentityMatcher<any> = (item1: StatusOption, item2: StatusOption) =>
    item1.value === item2.value;
  readonly getFilterLabel: TuiStringHandler<string> = (filter: string): string => `${getLabel[filter]}`;

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

  /*findMySeat(): void {
    const mySeatIndex = this.state.get('seatMap').seats?.findIndex((seat) => seat.assignedUser?.id === this.myId);
    if (mySeatIndex !== undefined && mySeatIndex > -1) {
      this.ping$.next(mySeatIndex);
      this.seatRefs.toArray()[mySeatIndex].elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      this.state.hold(timer(1000), () => this.ping$.next(-1));
    } else {
      this.seatMapControl.setValue({});
      this.state.hold(
        this.state.select().pipe(
          take(3),
          last(),
          switchMap(() => this.loading$),
          takeWhile((hidden) => hidden, true),
          last()
        ),
        () => this.findMySeat()
      );
    }
  }*/

  moveSeat(event: CdkDragStart, index: number): void {
    this.dragging$.next(true);
    /*event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
      const halfWidth = this.seatMap$.scaleX / 2;
      const halfHeight = this.seatMap$.scaleY / 2;
      const parent = data.source.element.nativeElement.parentElement as HTMLElement;
      const positionXDrop = this.seatMap$.seats[index].positionX + (data.distance.x / parent.offsetWidth) * 100;
      const positionYDrop = this.seatMap$.seats[index].positionY + (data.distance.y / parent.offsetHeight) * 100;

      let indexDrop: number | undefined;
      this.seatMap$.seats.some((seat, index) => {
        if (
          positionXDrop > seat.positionX - halfWidth &&
          positionXDrop < seat.positionX + halfWidth &&
          positionYDrop > seat.positionY - halfHeight &&
          positionYDrop < seat.positionY + halfHeight
        ) {
          indexDrop = index;
          return true;
        } else return false;
      });

      if (indexDrop !== undefined) {
        const drag = this.seatMap$.seats[index];
        const drop = this.seatMap$.seats[indexDrop];
        [drag.positionX, drag.positionY, drag.seatNumber, drop.positionX, drop.positionY, drop.seatNumber] = [
          drop.positionX,
          drop.positionY,
          drop.seatNumber,
          drag.positionX,
          drag.positionY,
          drag.seatNumber,
        ];
      }
    });*/
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

  onSearchChange(event: Event): void {
    this.searchAssignedUser$.next((event.target as HTMLInputElement)?.value);
  }
}
