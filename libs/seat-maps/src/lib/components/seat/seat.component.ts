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
import { of, Subject, Subscriber } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  @Input() seat!: Seat;
  @Input() active = false;
  @Output() assignUser = new EventEmitter<Seat>();
  open = false;
  readonly loading$ = new Subject<boolean>();
  readonly form = this.fb.group({});
  readonly model = {};
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
        autoFocus: true,
      },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  take(1),
                  tap(() => this.loading$.next(true)),
                  switchMap(({ id }: BaseUser) => this.seatMapsService.checkUserAlreadyHasASeat(id)),
                  tap(() => {
                    this.loading$.next(false);
                    control.markAsTouched();
                  })
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.userAlreadyHasASeat'),
        },
      },
    },
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
    this.assignUser.emit({ ...this.model, id: this.seat.id, seatStatus: 1 } as Seat);
  }

  deleteSeat(): void {
    this.open = false;
    this.assignUser.emit({ id: this.seat.id, seatStatus: 0 } as Seat);
  }

  getStatus(status: UserState): string {
    return UserState[status];
  }
}
