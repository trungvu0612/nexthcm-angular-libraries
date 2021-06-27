import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Injector, Input, OnInit } from '@angular/core';
import { Seat, User } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Subject } from 'rxjs';
import { HelpDeskService } from '../../services/help-desk.service';
import { AddSeatDialogComponent } from '../add-seat-dialog/add-seat-dialog.component';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatComponent implements OnInit {
  @Input() seat!: Partial<Seat>;
  @Input() refresh$!: Subject<unknown>;
  isAdmin = true;
  seatStatus = 'none';
  openDropdown = false;
  dragging$ = this.state.select('dragging');

  constructor(
    private helpDeskService: HelpDeskService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private state: RxState<{ dragging: boolean }>,
    public elementRef: ElementRef
  ) {}

  @Input() set dragging(dragging$: Subject<boolean>) {
    this.state.connect('dragging', dragging$);
  }

  @HostBinding('style.left') get left() {
    return this.seat.positionX + '%';
  }

  @HostBinding('style.top') get top() {
    return this.seat.positionY + '%';
  }

  @HostBinding('style.width') get width() {
    return this.seat.width + '%';
  }

  @HostBinding('style.height') get height() {
    return this.seat.height + '%';
  }

  @HostBinding('style.border-radius') get rounded() {
    return this.seat.rounded + '%';
  }

  ngOnInit(): void {
    if (this.seat.assignedUser) this.seatStatus = 'leave';
  }

  onClick(type: string): void {
    if (this.state.get('dragging')) {
      this.state.set({ dragging: false });
    } else if (type === 'add') this.addSeat();
  }

  addSeat(): void {
    this.dialogService
      .open<Partial<User> | null>(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
        size: 's',
        closeable: false,
      })
      .subscribe((user) => {
        if (user?.id && this.seat.id) {
          this.helpDeskService
            .updateAssignedUser(this.seat.id, { assignedUser: { id: user.id } })
            .subscribe(() => this.refresh$.next());
        }
      });
  }

  deleteSeat(): void {
    this.openDropdown = false;
    if (this.seat.id) {
      this.helpDeskService
        .updateAssignedUser(this.seat.id, { assignedUser: null })
        .subscribe(() => this.refresh$.next());
    }
  }
}
