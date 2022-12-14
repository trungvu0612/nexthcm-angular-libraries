import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeesService, JobTitlesService } from '@nexthcm/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TUI_DEFAULT_STRINGIFY } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ConditionType } from '../../enums';
import { TransitionCondition, TransitionOptionsDialogData } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-add-condition-to-transition-dialog',
  templateUrl: './add-condition-to-transition-dialog.component.html',
  styleUrls: ['./add-condition-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConditionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<TransitionCondition> {
  readonly conditionTypes$ = this.adminWorkflowsService.conditionTypes$.pipe(
    map((types) =>
      types
        .filter((type) => this.context.data.items.every((item) => item.conditionType.id !== type.id))
        .concat(this.context.data.item ? [this.context.data.item.conditionType] : [])
    )
  );
  fields: FormlyFieldConfig[] = [
    {
      key: 'conditionType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.conditionTypes$,
        required: true,
      },
    },
    {
      key: 'permissions',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'permissions',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchPermissions',
        required: true,
        stringify: TUI_DEFAULT_STRINGIFY,
        objectValue: false,
        serverRequest: (searchQuery: string) =>
          of(searchQuery).pipe(
            switchMap((searchQuery) =>
              iif(() => searchQuery.length > 2, this.adminWorkflowsService.getPermissions(searchQuery), of([]))
            )
          ),
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.Permission,
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'jobTitles',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchJobTitles',
        required: true,
        serverRequest: (searchQuery: string) => this.jobTitlesService.searchJobTitles(searchQuery),
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.UserInTitles,
    },
    {
      key: 'reportingMethods',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'supervisorTypes',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'chooseSupervisorTypes',
        required: true,
        options: this.employeesService.supervisorTypes$,
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.ReportingMethods,
    },
  ];

  constructor(
    override readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    override readonly context: TuiDialogContext<TransitionCondition, TransitionOptionsDialogData<TransitionCondition>>,
    override readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly jobTitlesService: JobTitlesService,
    private readonly employeesService: EmployeesService
  ) {
    super(fb, context, adminWorkflowsService);
    jobTitlesService.doLoadJobTitles();
    employeesService.doLoadSupervisorTypes();
  }
}
