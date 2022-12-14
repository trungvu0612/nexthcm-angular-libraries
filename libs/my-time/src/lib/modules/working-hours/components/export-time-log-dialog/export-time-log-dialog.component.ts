import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import { FileSaverService } from 'ngx-filesaver';
import { from, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { ExportTimeLogType } from '../../../../internal/enums';
import { ExportTimeLog } from '../../../../internal/models';
import { WorkingHoursService } from '../../../../internal/services';

@Component({
  selector: 'hcm-export-time-log-dialog',
  templateUrl: './export-time-log-dialog.component.html',
  styleUrls: ['./export-time-log-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ExportTimeLogDialogComponent {
  form = this.fb.group({} as ExportTimeLog);
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
      key: 'exportType',
      type: 'select',
      className: 'tui-form__row block',
      defaultValue: ExportTimeLogType.Detail,
      templateOptions: {
        translate: true,
        required: true,
        label: 'type',
        labelClassName: 'font-semibold',
        valueProp: 'value',
        options: this.translocoService.selectTranslateObject('EXPORT_TYPES').pipe(
          map((result) => [
            { label: result.detail, value: ExportTimeLogType.Detail },
            { label: result.aggregate, value: ExportTimeLogType.Aggregate },
            { label: result.cnb, value: ExportTimeLogType.CnB },
          ])
        ),
      },
    },
    {
      key: 'filterByMyTeam',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: `${this.translocoScope.scope}.filterByMyTeam`,
      },
    },
  ];

  // EVENTS
  readonly export$ = new Subject<{
    fromDate: Date;
    toDate: Date;
    exportType: ExportTimeLogType;
    filterType?: string;
  }>();

  // HANDLERS
  readonly exportHandler$ = this.export$.pipe(
    switchMap(({ fromDate, toDate, exportType, filterType }) => {
      let params = new HttpParams()
        .set('fromDate', fromDate.getTime())
        .set('toDate', endOfDay(toDate).getTime())
        .set('exportType', exportType);

      if (filterType) {
        params = params.set('filterType', filterType);
      }

      return this.workingHoursService.exportTimeLog(params).pipe(
        tap(({ blob, filename }) => {
          this.fileSaverService.save(blob, filename);
          this.context.completeWith();
        }),
        catchError((err) =>
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
        ),
        startWith(null)
      );
    }),
    share()
  );
  readonly exportLoading$ = this.exportHandler$.pipe(map((value) => !value));

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly workingHoursService: WorkingHoursService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<Record<string, unknown>>,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    private readonly promptService: PromptService,
    private readonly fileSaverService: FileSaverService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const {
        dateRange: { from, to },
        exportType,
        filterByMyTeam,
      } = this.form.value;
      const fromDate = from.toLocalNativeDate();
      const toDate = to.toLocalNativeDate();

      if (filterByMyTeam) {
        this.export$.next({ fromDate, toDate, exportType, filterType: 'MY_TEAM' });
      } else {
        this.export$.next({ fromDate, toDate, exportType });
      }
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
