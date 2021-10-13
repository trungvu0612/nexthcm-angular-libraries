import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subject, Subscriber } from 'rxjs';
import { UserState } from '../../enums/user-state';
import { Seat, StyleSeat } from '../../models';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatComponent {
  @Input() seat = {} as Seat;
  @Output() assignUser = new EventEmitter<Seat>();
  @Output() unAssignUser = new EventEmitter<string>();

  random = Math.round(Math.random() * 6);
  openDropdown = false;
  dragging$ = this.state.select('dragging');
  readonly form = this.fb.group<Seat>({} as Seat);
  model = { label: '', seatStatus: 1 } as Seat;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'assignedUser',
      type: 'user-combo-box',
      templateOptions: {
        labelClassName: 'font-semibold',
        required: true,
        translate: true,
        label: 'chooseUser',
        placeholder: 'searchUsers',
      },
    },
    { key: 'label' },
    { key: 'seatStatus' },
    { key: 'id' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly state: RxState<{ dragging: boolean }>
  ) {}

  @Input() set dragging(dragging$: Subject<boolean>) {
    this.state.connect('dragging', dragging$);
  }

  @HostBinding('style') get style() {
    return {
      left: Number((this.seat.style as StyleSeat).positionX) + '%',
      top: Number(this.seat.style as StyleSeat) + '%',
      width: '5%',
      height: '11.8%',
      'border-radius': (this.seat.style as StyleSeat).rounded + '%',
    };
  }

  statusState(statusUser: any): string {
    return this.seat.assignedUser ? UserState[statusUser] : '';
  }

  addSeatOrDropdown(type: string, content?: PolymorpheusContent<TuiDialogContext>): void {
    if (this.state.get('dragging')) {
      this.state.set({ dragging: false });
    } else if (type === 'add' && content) {
      this.dialogService.open(content).subscribe();
    }
  }

  submitSeat(observer: Subscriber<unknown>): void {
    if (this.form.valid) {
      observer.complete();

      this.model.id = this.seat.id;
      this.assignUser.emit(this.model);
    }
  }

  deleteSeat(): void {
    this.openDropdown = false;
    this.unAssignUser.emit(this.seat.id);
  }
}
