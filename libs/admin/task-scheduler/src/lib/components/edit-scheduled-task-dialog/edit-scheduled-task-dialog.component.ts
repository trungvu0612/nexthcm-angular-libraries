import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';

import { ScheduleType } from '../../enums';
import { ScheduledTask } from '../../models/scheduled-task';
import { TaskSchedulerService } from '../../services/task-scheduler.service';

@Component({
  selector: 'hcm-edit-scheduled-task-dialog',
  templateUrl: './edit-scheduled-task-dialog.component.html',
  styleUrls: ['./edit-scheduled-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EditScheduledTaskDialogComponent implements OnInit {
  form = this.fb.group({} as ScheduledTask);
  model = {} as ScheduledTask;
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
        options: [ScheduleType.interval, ScheduleType.cronJob],
      },
    },
    {
      key: 'value',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        label: `${this.translocoScope.scope}.value`,
        labelClassName: 'font-semibold',
        placeholder: `${this.translocoScope.scope}.enterSeconds`,
        min: 300,
        required: true,
        textfieldLabelOutside: true,
      },
      hideExpression: (model: ScheduledTask) => model.type !== ScheduleType.interval,
    },
    {
      key: 'value',
      className: 'tui-form__row block',
      type: 'quartz-cron',
      defaultValue: '* * * ? * * *',
      templateOptions: {
        required: true,
      },
      hideExpression: (model: ScheduledTask) => model.type !== ScheduleType.cronJob,
    },
    { key: 'id' },
    { key: 'name' },
    { key: 'description' },
  ];

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, ScheduledTask>,
    private readonly TaskSchedulerService: TaskSchedulerService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService
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
      const formModel: ScheduledTask = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.TaskSchedulerService.editScheduledTask(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(this.translocoScope.scope + '.editScheduledTaskSuccessfully', () =>
            this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
