import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { BaseUser } from '@nexthcm/cdk';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { NgxPermissionsService } from 'ngx-permissions';
import { from, iif, of, Subject, Subscriber } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { Seat, StyleSeat } from '../../models';
import { SeatMapsService } from '../../seat-maps.service';

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

  openDropdown = false;
  random = Math.round(Math.random() * 6);
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
      asyncValidators: {
        name: {
          expression: (control: AbstractControl<BaseUser>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((user: BaseUser) => this.seatMapsService.checkUserAlreadyHasASeat(user.id)),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.userAlreadyHasASeat'),
        },
      },
    },
    { key: 'label' },
    { key: 'seatStatus' },
    { key: 'id' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly state: RxState<{ dragging: boolean }>,
    private readonly seatMapsService: SeatMapsService,
    private readonly translocoService: TranslocoService,
    private readonly ngxPermissionsService: NgxPermissionsService
  ) {}

  @Input() set dragging(dragging$: Subject<boolean>) {
    this.state.connect('dragging', dragging$);
  }

  @HostBinding('style') get style() {
    return {
      left: (this.seat.style as StyleSeat).positionX + '%',
      top: (this.seat.style as StyleSeat).positionY + '%',
      width: (this.seat.style as StyleSeat).width + '%',
      height: (this.seat.style as StyleSeat).height + '%',
      'border-radius': (this.seat.style as StyleSeat).rounded + '%',
    };
  }

  addSeatOrDropdown(type: string, content?: PolymorpheusContent<TuiDialogContext>): void {
    if (this.state.get('dragging')) {
      this.state.set({ dragging: false });
    } else if (type === 'add' && content) {
      from(this.ngxPermissionsService.hasPermission('CREATE_SEAT'))
        .pipe(switchMap((hasPermission) => iif(() => hasPermission, this.dialogService.open(content))))
        .subscribe();
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
