import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { Seat } from '@nexthcm/cdk';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Subject, Subscriber } from 'rxjs';
import { UserState } from '../../enums/user-state';
import { SeatMapsService } from '../../seat-maps.service';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SeatComponent {
  @Input() seat!: Partial<Seat>;
  @Input() refresh$!: Subject<unknown>;
  random = Math.round(Math.random() * 6);
  openDropdown = false;
  dragging$ = this.state.select('dragging');
  readonly form = new FormGroup({});
  model: Partial<Seat> = {};
  readonly userInfo = this.authService.get('userInfo');
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'label',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'Number',
        labelClassName: 'font-semibold',
        placeholder: 'Position number',
      },
    },
    {
      key: 'assignedUser',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        labelClassName: 'font-semibold',
        required: true,
        translate: true,
        label: 'chooseUser',
      },
    },
  ];

  constructor(
    private readonly seatMapsService: SeatMapsService,
    private readonly dialogService: TuiDialogService,
    private readonly state: RxState<{ dragging: boolean }>,
    public readonly elementRef: ElementRef,
    private authService: AuthService
  ) {}

  @Input() set dragging(dragging$: Subject<boolean>) {
    this.state.connect('dragging', dragging$);
  }

  @HostBinding('style') get style() {
    return {
      left: Number(this.seat.positionX) + '%',
      top: Number(this.seat.positionY) + '%',
      width: '5%',
      height: '11.8%',
      'border-radius': this.seat.rounded + '%',
    };
  }

  get status(): string {
    return this.seat.assignedUser ? UserState[this.random] + ' seatmap_status' : 'seatmap_status';
  }

  get convertedStatus(): string {
    return this.status === 'none'
      ? 'NA'
      : this.status
          .replace('in-out', 'in/out')
          .replace('seatmap_status', '')
          .replace(/-/g, ' ')
          .replace(/^./, (m) => m.toUpperCase());
  }

  statusState(statusUser: any): string {
    return this.seat.assignedUser ? UserState[statusUser] + ' seatmap_status' : 'seatmap_status';
  }

  addSeatOrDropdown(type: string, content?: PolymorpheusContent<TuiDialogContext>): void {
    if (this.state.get('dragging')) this.state.set({ dragging: false });
    else if (type === 'add' && content) this.dialogService.open(content).subscribe();
  }

  submitSeat(observer: Subscriber<unknown>): void {
    if (this.form.valid) {
      observer.complete();
      this.seatMapsService.assignedUser(this.seat.id || '', this.model).subscribe(() => this.refresh$.next());
    }
  }

  deleteSeat(): void {
    this.openDropdown = false;
    if (this.seat.id) {
      this.seatMapsService.assignedUser(this.seat.id, { assignedUser: null }).subscribe(() => this.refresh$.next());
    }
  }
}
