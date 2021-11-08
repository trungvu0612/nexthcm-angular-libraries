import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ng-stack/forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import { FileSaverService } from 'ngx-filesaver';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { ExportTimeLogType } from '../../../../internal/enums';
import { ExportTimeLog } from '../../../../internal/models';
import { WorkingHoursService } from '../../../../services/working-hours.service';

@Component({
  selector: 'hcm-export-time-log-dialog',
  templateUrl: './export-time-log-dialog.component.html',
  styleUrls: ['./export-time-log-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ExportTimeLogDialogComponent {
  form = this.fb.group<ExportTimeLog>({} as ExportTimeLog);
  fields: FormlyFieldConfig[] = [
    {
      key: 'dateRange',
      type: 'input-date-range',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        required: true,
        label: 'dateRange',
        labelClassName: 'font-semibold',
        placeholder: 'chooseDateRange',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'type',
      type: 'select',
      className: 'tui-form__row block',
      defaultValue: ExportTimeLogType.Detail,
      templateOptions: {
        translate: true,
        required: true,
        label: 'type',
        labelClassName: 'font-semibold',
        valueProp: 'value',
        options: this.translocoService
          .selectTranslateObject('EXPORT_TIME_LOG_TYPES', {}, (this.scope as ProviderScope).scope)
          .pipe(
            map((result) => [
              { label: result.detail, value: ExportTimeLogType.Detail },
              { label: result.aggregate, value: ExportTimeLogType.Aggregate },
            ])
          ),
      },
    },
  ];

  // EVENTS
  readonly submit$ = new Subject<{ fromDate: Date; toDate: Date; exportType: ExportTimeLogType }>();

  // HANDLERS
  readonly submitHandler$ = this.submit$.pipe(
    switchMap(({ fromDate, toDate, exportType }) => {
      const params = new HttpParams()
        .set('fromDate', fromDate.getTime())
        .set('toDate', endOfDay(toDate).getTime())
        .set('exportType', exportType);
      const fileName = `${formatDate(fromDate, 'mediumDate', this.locale)}_${formatDate(
        toDate,
        'mediumDate',
        this.locale
      )}_${exportType}`;

      return this.workingHoursService.onExportTimeLog(params).pipe(
        tap((blob) => this.fileSaverService.save(blob, fileName)),
        startWith(null)
      );
    }),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(map((value) => !value));
  readonly submitEffect$ = this.submitHandler$.pipe(
    filter(isPresent),
    tap(() => this.context.completeWith()),
    catchError(() => of({}))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly workingHoursService: WorkingHoursService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<Record<string, unknown>>,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    private readonly promptService: PromptService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly fileSaverService: FileSaverService,
    @Inject(LOCALE_ID) private readonly locale: string
  ) {
    state.hold(this.submitEffect$);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const {
        dateRange: { from, to },
        exportType,
      } = this.form.value;
      const fromDate = from.toUtcNativeDate();
      const toDate = to.toUtcNativeDate();

      this.submit$.next({ fromDate, toDate, exportType });
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}