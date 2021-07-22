import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { Seat, UserDto } from '@nexthcm/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, Subscriber } from 'rxjs';
import { HelpDeskService } from '../../services/help-desk.service';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';
import { filterBySearch } from '@nexthcm/ui';

enum USER_STATE {
  'checked-in',
  'not-check-in-out',
  'check-in-late',
  'working-outside',
  'leave',
  'offline',
  'none',
}

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
  isAdmin = true;
  random = Math.round(Math.random() * 6);
  openDropdown = false;
  dragging$ = this.state.select('dragging');
  readonly form = new FormGroup({});
  model: Partial<Seat> = {};
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'assignedUser.id',
      type: 'combo-box',
      templateOptions: {
        required: true,
        translate: true,
        label: 'chooseUser',
        labelProp: 'username',
        subLabelProp: 'code',
        stringify: (item: UserDto) => item.username,
        serverRequest: (search: string): Observable<Partial<UserDto>[]> =>
          this.helpDeskService.select('users').pipe(map((users) => filterBySearch<UserDto>(users, search, 'username'))),
      },
    },
  ];

  constructor(
    private readonly helpDeskService: HelpDeskService,
    private readonly dialogService: TuiDialogService,
    private readonly state: RxState<{ dragging: boolean }>,
    public readonly elementRef: ElementRef
  ) {}

  @Input() set dragging(dragging$: Subject<boolean>) {
    this.state.connect('dragging', dragging$);
  }

  @HostBinding('style') get style() {
    return {
      left: this.seat.positionX + '%',
      top: this.seat.positionY + '%',
      width: this.seat.width + '%',
      height: this.seat.height + '%',
      'border-radius': this.seat.rounded + '%',
    };
  }

  get status(): string {
    return this.seat.assignedUser ? USER_STATE[this.random] : '';
  }

  get convertedStatus(): string {
    return this.status === 'none'
      ? 'NA'
      : this.status
          .replace('in-out', 'in/out')
          .replace(/-/g, ' ')
          .replace(/^./, (m) => m.toUpperCase());
  }

  addSeatOrDropdown(type: string, content?: PolymorpheusContent<TuiDialogContext>): void {
    if (this.state.get('dragging')) this.state.set({ dragging: false });
    else if (type === 'add' && content) this.dialogService.open(content).subscribe();
  }

  submitSeat(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
      this.helpDeskService.assignedUser(this.seat.id || '', this.model).subscribe(() => this.refresh$.next());
    }
  }

  deleteSeat(): void {
    this.openDropdown = false;
    if (this.seat.id) {
      this.helpDeskService.assignedUser(this.seat.id, { assignedUser: null }).subscribe(() => this.refresh$.next());
    }
  }
}
