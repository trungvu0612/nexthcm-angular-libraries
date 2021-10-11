import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { SyncType } from '../../enums';
import { SynchronizationSetting } from '../../models/synchronization-setting';
import { SynchronizeDataService } from '../../services/synchronize-data.service';

@Component({
  selector: 'hcm-edit-synchronization-setting-dialog',
  templateUrl: './edit-synchronization-setting-dialog.component.html',
  styleUrls: ['./edit-synchronization-setting-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EditSynchronizationSettingDialogComponent implements OnInit {
  form = this.fb.group<SynchronizationSetting>({} as SynchronizationSetting);
  model = {} as SynchronizationSetting;
  fields: FormlyFieldConfig[] = [
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'type',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'type',
        labelClassName: 'font-semibold',
        placeholder: 'chooseType',
        options: [SyncType.interval, SyncType.cronJob],
      },
    },
    {
      key: 'value',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        label: 'value',
        labelClassName: 'font-semibold',
        placeholder: 'enterSeconds',
        min: 300,
        required: true,
        textfieldLabelOutside: true,
        translocoScope: this.scope,
      },
      hideExpression: (model: SynchronizationSetting) => model.type !== SyncType.interval,
    },
    {
      key: 'value',
      className: 'tui-form__row block',
      type: 'quartz-cron',
      defaultValue: '* * * ? * * *',
      templateOptions: {
        required: true,
      },
      hideExpression: (model: SynchronizationSetting) => model.type !== SyncType.cronJob,
    },
    { key: 'id' },
    { key: 'name' },
    { key: 'description' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, SynchronizationSetting>,
    private readonly synchronizeDataService: SynchronizeDataService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.status === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: SynchronizationSetting = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.synchronizeDataService
        .editSynchronizationSetting(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse('SCHEDULER.editSynchronizationSettingSuccessfully', () =>
            this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
