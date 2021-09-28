import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import { InitWorkflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadStatuses, loadStatusTypes, StatusTypesQuery } from '../../state';

@Component({
  selector: 'hcm-create-workflow-dialog',
  templateUrl: './create-workflow-dialog.component.html',
  styleUrls: ['./create-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateWorkflowDialogComponent {
  form = this.fb.group<InitWorkflow>({} as InitWorkflow);
  model = {} as InitWorkflow;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'processName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'processDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'enterDescription',
      },
    },
    {
      className: 'tui-form__row block',
      key: 'initStatus',
      type: 'status-combobox',
      templateOptions: {
        translate: true,
        required: true,
        label: 'initStatus',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchStatusOrNameNewOne',
        translocoScope: this.scope,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'initStatusDescription',
        labelClassName: 'font-semibold',
        placeholder: 'enterStatusDescription',
        textfieldLabelOutside: true,
        translocoScope: this.scope,
      },
      hideExpression: '!model.initStatus || model.initStatus?.id',
    },
    {
      className: 'tui-form__row block',
      key: 'stateType',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        options: this.statusTypesQuery.selectAll(),
        label: 'statusType',
        labelClassName: 'font-semibold',
        placeholder: 'chooseStatusType',
        labelProp: 'name',
        matcherBy: 'id',
        translocoScope: this.scope,
      },
      hideExpression: '!model.initStatus || model.initStatus?.id',
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<string, InitWorkflow>,
    private readonly workflowService: AdminWorkflowsService,
    private readonly statusTypesQuery: StatusTypesQuery,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    action: Actions
  ) {
    action.dispatch(loadStatuses());
    action.dispatch(loadStatusTypes());
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.model };

      formModel.stateName = formModel.initStatus.name;
      if (formModel.initStatus.id) {
        formModel.stateDescription = formModel.initStatus.description;
        formModel.stateType = formModel.initStatus.stateType;
      }
      this.workflowService
        .initWorkflow(formModel)
        .pipe(
          tap(() => this.promptService.handleResponse()),
          takeUntil(this.destroy$)
        )
        .subscribe((res) => this.context.completeWith(res.data.id));
    }
  }
}
