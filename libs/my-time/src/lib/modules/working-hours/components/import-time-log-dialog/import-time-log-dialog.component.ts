import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TUI_FIRST_DAY, TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import omit from 'just-omit';
import { API, BaseComponent, Columns, DefaultConfig } from 'ngx-easy-table';
import { merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { catchError, filter, map, mapTo } from 'rxjs/operators';

import { Base, UserTimeLog } from '../../../../internal/models/import-time-log';
import { WorkingHoursService } from '../../../../internal/services';

interface UserTimeLogForm extends Base {
  dateTracking: TuiDay | null;
  timeIn: TuiTime | null;
  timeOut: TuiTime | null;
}

const convertTime = (time: string): TuiTime | null => {
  const [hour, minute] = time.split(':').map((v) => +v);
  return TuiTime.isValidTime(hour, minute) ? new TuiTime(hour, minute) : null;
};

@Component({
  selector: 'hcm-import-time-log-dialog',
  templateUrl: './import-time-log-dialog.component.html',
  styleUrls: ['./import-time-log-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ImportTimeLogDialogComponent {
  @ViewChild('table') table!: BaseComponent;
  openDialog = false;
  activeRowIndex!: number;
  model!: UserTimeLogForm;
  form!: FormGroup;
  fields: FormlyFieldConfig[] = [
    {
      key: 'cif',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'cif',
        labelClassName: 'font-semibold',
        placeholder: 'enterCif',
      },
    },
    {
      key: 'fullName',
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
      key: 'office',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'office',
        labelClassName: 'font-semibold',
        placeholder: 'enterOfficeName',
      },
    },
    {
      key: 'dateTracking',
      className: 'tui-form__row block',
      type: 'input-date',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'date',
        labelClassName: 'font-semibold',
        placeholder: 'chooseADate',
      },
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'flex gap-4',
      fieldGroup: [
        {
          key: 'timeIn',
          className: 'flex-1',
          type: 'input-time',
          templateOptions: {
            required: true,
            translate: true,
            textfieldLabelOutside: true,
            label: 'inTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterInTime',
          },
        },
        {
          key: 'timeOut',
          className: 'flex-1',
          type: 'input-time',
          templateOptions: {
            required: true,
            translate: true,
            textfieldLabelOutside: true,
            label: 'outTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterOutTime',
          },
        },
      ],
    },
  ];
  readonly configuration = {
    ...DefaultConfig,
    paginationEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('IMPORT_TIME_LOG', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'cif', title: result.cif },
        { key: 'fullName', title: result.fullName },
        { key: 'office', title: result.office },
        { key: 'date', title: result.date },
        { key: 'inTime', title: result.inTime },
        { key: 'outTime', title: result.outTime },
        { key: 'action', title: result.action },
      ])
    );
  rejectedFile: TuiFileLike | null = null;
  readonly fileControl = this.fb.control(null);

  loading = false;
  readonly importHandler$ = this.fileControl.valueChanges.pipe(
    filter(isPresent),
    tap(() => {
      this.rejectedFile = null;
      this.loading = true;
    }),
    switchMap((file) =>
      this.workingHoursService.importTimeLog(file).pipe(
        catchError((err) => {
          this.fileControl.setValue(null);
          this.rejectedFile = file;
          this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) });
          return of([]);
        })
      )
    ),
    tap(({ length }) => {
      this.loading = false;
      this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: length });
    })
  );

  submitting = false;
  readonly submit$ = new Subject<UserTimeLog[]>();
  readonly submitHandler$: Observable<UserTimeLog[]> = this.submit$.pipe(
    tap(() => (this.submitting = true)),
    switchMap((data) =>
      this.workingHoursService.saveTimeLog(data).pipe(
        switchMap(() =>
          this.promptService.open({
            icon: 'success',
            html: this.translocoService.translate(this.translocoScope.scope + '.importDataSuccessfully'),
          })
        ),
        tap(() => this.context.completeWith()),
        mapTo(null),
        catchError((err) => {
          this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) });
          const { message, errorMetadata } = err.error;
          return of(
            message === 'ONE_OF_DATA_IS_WRONG_FORMAT_OR_DATA_NOT_FOUND_OR_DATA_IS_DUPLICATED' ? errorMetadata : null
          );
        })
      )
    ),
    tap(() => (this.submitting = false)),
    filter(isPresent)
  );

  readonly data$ = this.state.select('data');
  readonly canSubmit$ = this.data$.pipe(
    map((data) => {
      const invalidData = data.filter(
        ({ isEdited, isDuplicateRecord, isWrongFormat, isDataNotFound }) =>
          !isEdited && (isDuplicateRecord || isWrongFormat || isDataNotFound)
      );
      return data.length && !invalidData.length;
    })
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly workingHoursService: WorkingHoursService,
    private readonly promptService: PromptService,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<{ data: UserTimeLog[] }>
  ) {
    this.state.set({ data: [] });
    this.state.connect('data', merge(this.importHandler$, this.submitHandler$));
  }

  item = (item: UserTimeLog) => item;

  onEdit({ dateTracking, timeIn, timeOut, ...value }: UserTimeLog, index: number): void {
    const date = TuiDay.normalizeParse(dateTracking);
    this.model = {
      ...value,
      dateTracking: date.daySame(TUI_FIRST_DAY) ? null : date,
      timeIn: convertTime(timeIn),
      timeOut: convertTime(timeOut),
    };
    this.form?.reset();
    this.form = this.fb.group(this.model);
    this.activeRowIndex = index;
    this.openDialog = true;
  }

  onSave(): void {
    if (this.form.valid) {
      const { dateTracking, timeIn, timeOut, ...value } = this.model;
      if (dateTracking && timeIn && timeOut) {
        const newValue = {
          ...value,
          dateTracking: dateTracking.toString('DMY', '-'),
          timeIn: timeIn.toString('HH:MM'),
          timeOut: timeOut.toString('HH:MM'),
          isEdited: true,
        };
        this.state.set('data', ({ data }) =>
          data.map((item, index) => (this.activeRowIndex === index ? newValue : item))
        );
        this.openDialog = false;
      }
    }
  }

  onRemove(removeIndex: number): void {
    this.state.set('data', ({ data }) => data.filter((_, index) => index !== removeIndex));
  }

  onSubmit(): void {
    this.submit$.next(this.state.get('data').map((item) => omit(item, 'isEdited')));
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
