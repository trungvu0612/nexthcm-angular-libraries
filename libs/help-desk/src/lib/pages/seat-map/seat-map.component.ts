import { CdkDragStart } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Zone } from '@nexthcm/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { BehaviorSubject, merge, Observable, Subject, timer } from 'rxjs';
import { filter, last, map, shareReplay, startWith, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { SeatComponent } from '../../components/seat/seat.component';
import { HelpDeskService } from '../../services/help-desk.service';

@Component({
  selector: 'hcm-seat-map',
    templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatMapComponent {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  myId = this.authService.get('userInfo').userId;
  ping$ = new BehaviorSubject(-1);
  hidden$ = new BehaviorSubject(true);
  refresh$ = new Subject();
  seatMap$ = this.state.select('seatMap');
  dragging$ = new Subject<boolean>();
  seatMaps$ = this.helpDeskService.getSeatMaps().pipe(shareReplay(1));
  form = new FormGroup({});
  model: { seatMap?: Partial<Zone> } = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'seatMap',
      type: 'combo-box',
      templateOptions: {
        label: 'Seat Map List',
        textfieldSize: 'm',
        textfieldLabelOutside: false,
        icon: 'assets/icons/office-building.svg',
        subLabelProp: 'office.name',
        identityMatcher: (i1: Partial<Zone>, i2: Partial<Zone>) => i1.id === i2.id,
        serverRequest: (search: string): Observable<Partial<Zone>[]> =>
          this.seatMaps$.pipe(map((maps) => filterBySearch(maps, search))),
      },
    },
  ];

  constructor(
    private helpDeskService: HelpDeskService,
    private authService: AuthService,
    private state: RxState<{ seatMap: Partial<Zone> }>
  ) {
    this.state.connect(
      'seatMap',
      merge(this.refresh$, this.form.valueChanges.pipe(filter((value) => value.seatMap))).pipe(
        startWith(null),
        switchMap(() => this.helpDeskService.getSeatMap(this.model.seatMap?.id || '')),
        tap((zone) => {
          if (!this.model.seatMap?.id) this.model = { seatMap: zone };
          zone.seats?.forEach((seat) => Object.assign(seat, JSON.parse(seat.style || '')));
          if (zone.imageUrl !== this.state.get('seatMap')?.imageUrl) this.hidden$.next(true);
        })
      )
    );
  }

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
      this.model = { seatMap: undefined };
      this.refresh$.next();
      this.state.hold(
        this.state.select().pipe(
          take(3),
          last(),
          switchMap(() => this.hidden$),
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
