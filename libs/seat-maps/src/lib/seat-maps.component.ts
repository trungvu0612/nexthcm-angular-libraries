import { CdkDragStart } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiIdentityMatcher } from '@taiga-ui/cdk';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, share, startWith, switchMap, take, tap } from 'rxjs/operators';
import { SeatComponent } from './components/seat/seat.component';
import { Seat, SeatMap } from './models/seat-map';
import { SeatMapsService } from './seat-maps.service';

interface ComponentState {
  seatMapData: SeatMap;
  loading: boolean;
}

interface StatusAnnotate {
  key: keyof SeatMap;
  className: string;
  label: string;
}

@Component({
  selector: 'hcm-seat-maps',
  templateUrl: './seat-maps.component.html',
  styleUrls: ['./seat-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatMapsComponent {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  readonly ping$ = new BehaviorSubject(-1);
  readonly dragging$ = new Subject<boolean>();
  readonly seatMapControl = new FormControl<SeatMap>();
  readonly allSeatMaps$ = this.seatMapsService.getAllSeatMaps();
  readonly statusesAnnotate: StatusAnnotate[] = [
    {
      key: 'countCheckedIn',
      className: 'checked-in',
      label: 'checkedIn',
    },
    {
      key: 'countCheckedInLate',
      className: 'checked-in-late',
      label: 'checkedInLate',
    },
    {
      key: 'countCheckoutEarly',
      className: 'checked-out-early',
      label: 'checkedOutEarly',
    },
    {
      key: 'countCheckedOut',
      className: 'checked-out',
      label: 'checkedOut',
    },
    {
      key: 'countLeave',
      className: 'leave',
      label: 'leave',
    },
    {
      key: 'countWorkingOutsite',
      className: 'working-onsite',
      label: 'workingOnsite',
    },
    {
      key: 'countWfh',
      className: 'work-from-home',
      label: 'workFromHome',
    },
    {
      key: 'countNotCheckInOut',
      className: 'not-checked-in',
      label: 'notCheckedIn',
    },
  ];

  // READS
  readonly loading$ = this.state.select('loading');
  readonly seatMap$ = this.state.select('seatMapData');

  // EVENTS
  readonly assignUserToSeat$ = new Subject<Seat>();

  // HANDLER
  readonly assignUserToSeatHandler$ = this.assignUserToSeat$.pipe(
    switchMap((payload) => this.seatMapsService.assignUserForSeat(payload.id, payload)),
    tap(() => this.seatMapControl.setValue(this.seatMapControl.value))
  );

  private readonly request$ = this.seatMapControl.value$.pipe(
    switchMap((value) =>
      this.seatMapsService.getSeatMap(value?.id).pipe(
        tap((seatMap) =>
          this.state.set('loading', () => seatMap && seatMap?.imageUrl !== this.state.get('seatMapData', 'imageUrl'))
        ),
        startWith(null)
      )
    ),
    share()
  );

  constructor(private readonly seatMapsService: SeatMapsService, private readonly state: RxState<ComponentState>) {
    this.state.connect('seatMapData', this.request$.pipe(filter(isPresent)));
    this.state.hold(
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
    /*this.state.connect(
      'loading',
      this.request$.pipe(
        catchError(() => of({})),
        map((value) => !value)
      )
    );*/
    this.state.hold(this.assignUserToSeatHandler$);
  }

  readonly identityMatcher: TuiIdentityMatcher<SeatMap | string> = (item1, item2) =>
    (item1 as SeatMap).id === (item2 as SeatMap).id;

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
}
