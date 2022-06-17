import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { JobTitlesService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { PostFunctionType } from '../../enums';
import { TransitionOptionsDialogData, TransitionPostFunction, TransitionPostFunctionValue } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-add-post-function-to-transition-dialog',
  templateUrl: './add-post-function-to-transition-dialog.component.html',
  styleUrls: ['./add-post-function-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AddPostFunctionToTransitionDialogComponent
  extends AbstractAddOptionToTransitionComponent<TransitionPostFunction>
  implements OnInit
{
  readonly postFunctionTypes$ = this.adminWorkflowsService.postFunctionTypes$.pipe(
    map((types) =>
      types
        .filter((type) => this.context.data.items.every((item) => item.postFunctionType.id !== type.id))
        .concat(this.context.data.item ? [this.context.data.item.postFunctionType] : [])
    )
  );
  override model = { values: [{}] } as TransitionPostFunction;
  options: FormlyFormOptions = {
    formState: {
      postFunctionTypeCode: undefined,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'postFunctionType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.postFunctionTypes$,
        required: true,
      },
      hooks: {
        onInit: (field) => {
          const formControl = field?.formControl;

          formControl?.valueChanges
            .pipe(startWith(formControl?.value), takeUntil(this.destroy$))
            .subscribe((postFunctionType) => (this.options.formState.postFunctionTypeCode = postFunctionType?.code));
        },
      },
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'field-array-single-item',
      fieldArray: {
        fieldGroup: [
          {
            key: 'jobTitle',
            className: 'tui-form__row block',
            type: 'combo-box',
            templateOptions: {
              translate: true,
              label: 'jobTitle',
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              placeholder: 'searchJobTitles',
              required: true,
              serverRequest: (searchQuery: string) => this.jobTitlesService.searchJobTitles(searchQuery),
            },
            hideExpression: (model, formState) =>
              ![
                PostFunctionType.SendEmailAndNotificationToTheLeaderWithASpecifiedTitle,
                PostFunctionType.AssignToTheNearestLeaderWithASpecifiedTitle,
              ].includes(formState.postFunctionTypeCode),
          },
          {
            key: 'emailTemplate',
            className: 'tui-form__row block',
            type: 'select',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.emailTemplate`,
              labelClassName: 'font-semibold',
              placeholder: `${this.translocoScope.scope}.chooseEmailTemplate`,
              required: true,
              options: this.adminWorkflowsService.emailTemplates$,
              matcherBy: 'id',
              labelProp: 'name',
            },
            hideExpression: (model, formState) =>
              ![
                PostFunctionType.SendEmailAndNotificationToTheLeaderWithASpecifiedTitle,
                PostFunctionType.SendEmailAndNotificationToTheNewAssignee,
                PostFunctionType.SendEmailAndNotificationToTheReporter,
                PostFunctionType.SendEmailAndNotificationToTheSomeoneRelated,
                PostFunctionType.SendEmailAndNotificationToTheSupervisor,
              ].includes(formState.postFunctionTypeCode),
          },
        ],
      },
    },
  ];

  constructor(
    override readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    override readonly context: TuiDialogContext<
      TransitionPostFunction,
      TransitionOptionsDialogData<TransitionPostFunction>
    >,
    override readonly adminWorkflowsService: AdminWorkflowsService,
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly jobTitlesService: JobTitlesService,
    private readonly destroy$: TuiDestroyService
  ) {
    super(fb, context, adminWorkflowsService);
    jobTitlesService.doLoadJobTitles();
    adminWorkflowsService.doLoadEmailTemplates();
  }

  override ngOnInit(): void {
    if (this.context.data.item) {
      const data = { ...this.context.data.item };

      if (!data.values.length) {
        data.values = [{}] as [TransitionPostFunctionValue];
      }
      this.model = { ...this.model, ...data };
    }
  }
}
