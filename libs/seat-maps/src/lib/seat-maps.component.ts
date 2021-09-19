import { CdkDragStart } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { filterBySearch, Zone } from '@nexthcm/cdk';
import { FormControl } from '@ngneat/reactive-forms';
import { RxState } from '@rx-angular/state';
import { BehaviorSubject, combineLatest, Subject, timer } from 'rxjs';
import { last, map, startWith, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { SeatComponent } from './components/seat/seat.component';
import { SeatMapsService } from './seat-maps.service';
import { TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-seat-maps',
  templateUrl: './seat-maps.component.html',
  styleUrls: ['./seat-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatMapsComponent {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  readonly myId = this.authService.get('userInfo').userId;
  readonly ping$ = new BehaviorSubject(-1);
  readonly loading$ = new BehaviorSubject(true);
  readonly refresh$ = new Subject();
  readonly seatMap$ = this.state.select('seatMap');
  readonly dragging$ = new Subject<boolean>();
  readonly search$ = new BehaviorSubject('');
  readonly seatMaps$ = combineLatest([this.seatMapsService.select('seatMaps'), this.search$]).pipe(
    map(([seatMaps, search]) => {
      return search ? filterBySearch<Zone>(seatMaps, search) : seatMaps;
    })
  );
  readonly seatMapControl = new FormControl<Partial<Zone>>();

  constructor(
    private seatMapsService: SeatMapsService,
    private authService: AuthService,
    private state: RxState<{ seatMap: Partial<Zone> }>
  ) {
    this.state.connect(
      'seatMap',
      this.refresh$.pipe(
        startWith(null),
        switchMap(() => this.seatMapsService.getSeatMap(this.seatMapControl.value?.id || '')),
        tap((zone) => {
          if (zone.id) {
            this.seatMapControl.setValue(zone, { emitEvent: false });
            zone.seats?.forEach((seat) => Object.assign(seat, JSON.parse(seat.style || '')));
            if (zone.imageUrl !== this.state.get('seatMap')?.imageUrl) this.loading$.next(true);
          } else this.loading$.next(false);
        })
      )
    );
    this.state.hold(this.seatMapControl.valueChanges, () => this.refresh$.next());
  }

  readonly stringify: TuiStringHandler<Zone | string> = (item: Zone | string): string => (item as Zone).name;

  findMySeat(): void {
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
  }

  moveSeat(event: CdkDragStart, index: number): void {
    this.dragging$.next(true);
    // event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
    //   const halfWidth = this.seatMap$.scaleX / 2;
    //   const halfHeight = this.seatMap$.scaleY / 2;
    //   const parent = data.source.element.nativeElement.parentElement as HTMLElement;
    //   const positionXDrop = this.seatMap$.seats[index].positionX + (data.distance.x / parent.offsetWidth) * 100;
    //   const positionYDrop = this.seatMap$.seats[index].positionY + (data.distance.y / parent.offsetHeight) * 100;
    //
    //   let indexDrop: number | undefined;
    //   this.seatMap$.seats.some((seat, index) => {
    //     if (
    //       positionXDrop > seat.positionX - halfWidth &&
    //       positionXDrop < seat.positionX + halfWidth &&
    //       positionYDrop > seat.positionY - halfHeight &&
    //       positionYDrop < seat.positionY + halfHeight
    //     ) {
    //       indexDrop = index;
    //       return true;
    //     } else return false;
    //   });
    //
    //   if (indexDrop !== undefined) {
    //     const drag = this.seatMap$.seats[index];
    //     const drop = this.seatMap$.seats[indexDrop];
    //     [drag.positionX, drag.positionY, drag.seatNumber, drop.positionX, drop.positionY, drop.seatNumber] = [
    //       drop.positionX,
    //       drop.positionY,
    //       drop.seatNumber,
    //       drag.positionX,
    //       drag.positionY,
    //       drag.seatNumber,
    //     ];
    //   }
    // });
  }
}
