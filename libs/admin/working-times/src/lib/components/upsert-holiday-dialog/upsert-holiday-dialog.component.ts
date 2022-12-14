import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Holiday, HolidayForm, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-upsert-holiday-dialog',
  templateUrl: './upsert-holiday-dialog.component.html',
  styleUrls: ['./upsert-holiday-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertHolidayDialogComponent implements OnInit {
  form = new FormGroup({});
  model = {} as HolidayForm;
  fields: FormlyFieldConfig[] = [
    {
      key: 'holidayDate',
      className: 'tui-form__row block',
      type: 'input-date',
      templateOptions: {
        label: 'date',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'enterDate',
        translate: true,
      },
    },
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
      },
    },
    {
      key: 'recurringType',
      className: 'tui-form__row block',
      type: 'select',
      defaultValue: 'NONE',
      templateOptions: {
        translate: true,
        label: 'repeat',
        labelClassName: 'font-semibold',
        valueProp: 'value',
        options: this.translocoService.selectTranslateObject('RECURRING_TYPE', {}, this.translocoScope.scope).pipe(
          map((result) => [
            { label: result.NONE, value: 'NONE' },
            { label: result.MONTHLY, value: 'MONTHLY' },
            { label: result.YEARLY, value: 'YEARLY' },
          ])
        ),
      },
    },
    {
      key: 'paidHoliday',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: 'payable',
      },
    },
    { key: 'id' },
  ];
  readonly submit$ = new Subject<HolidayForm>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.workingTimesService.upsertHoliday(payload).pipe(
        tap(
          this.promptService.handleResponse(
            this.translocoScope.scope + (payload.id ? '.editHolidaySuccessfully' : '.addHolidaySuccessfully'),
            () => this.context.completeWith(true)
          )
        ),
        catchError(() => of({})),
        startWith(null)
      )
    ),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, Holiday>,
    private readonly workingTimesService: WorkingTimesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        holidayDate: TuiDay.fromLocalNativeDate(new Date(this.context.data.holidayDate as number)),
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: HolidayForm = { ...this.form.value };

      formModel.holidayDate = (formModel.holidayDate as TuiDay).toLocalNativeDate().valueOf();
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
