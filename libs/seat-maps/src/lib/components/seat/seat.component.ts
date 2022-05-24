import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { BaseUser, Seat, SeatMapsService, StyleSeat, UserState } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { NgxPermissionsService } from 'ngx-permissions';
import { of, Subscriber } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  @Input() seat = {} as Seat;
  @Input() active = false;
  @Output() assignUser = new EventEmitter<Seat>();
  @Output() unAssignUser = new EventEmitter<string>();
  open = false;
  readonly form = this.fb.group({});
  model = { label: '', seatStatus: 1 } as Seat;
  readonly fields = [
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
          expression: (control: AbstractControl) =>
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
    readonly elementRef: ElementRef,
    private readonly fb: FormBuilder,
    private readonly dialogService: TuiDialogService,
    private readonly seatMapsService: SeatMapsService,
    private readonly translocoService: TranslocoService,
    private readonly ngxPermissionsService: NgxPermissionsService
  ) {}

  @HostBinding('style') get style() {
    return {
      left: (this.seat.style as StyleSeat).positionX + '%',
      top: (this.seat.style as StyleSeat).positionY + '%',
      width: (this.seat.style as StyleSeat).width + '%',
      height: (this.seat.style as StyleSeat).height + '%',
      'border-radius': (this.seat.style as StyleSeat).rounded + '%',
    };
  }

  get borderRadius(): string {
    return `${(this.seat.style as StyleSeat).rounded}%`;
  }

  addSeat(content: PolymorpheusContent<TuiDialogContext>): void {
    this.ngxPermissionsService
      .hasPermission('CREATE_SEAT')
      .then((hasPermission) => hasPermission && this.dialogService.open(content).subscribe());
  }

  submitSeat(observer: Subscriber<unknown>): void {
    observer.complete();
    this.model.id = this.seat.id;
    this.assignUser.emit(this.model);
  }

  deleteSeat(): void {
    this.open = false;
    this.unAssignUser.emit(this.seat.id);
  }

  getStatus(status: UserState): string {
    return UserState[status];
  }
}
