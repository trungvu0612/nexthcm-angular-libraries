import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { JobTitlesQuery, loadJobTitles } from '@nexthcm/cdk';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { PostFunctionType } from '../../enums';
import { TransitionOption, TransitionOptionsDialogData, TransitionPostFunction } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadEmailTemplates } from '../../state/email-templates.actions';
import { EmailTemplatesQuery } from '../../state/email-templates.state';

@Component({
  selector: 'hcm-add-post-function-to-transition-dialog',
  templateUrl: './add-post-function-to-transition-dialog.component.html',
  styleUrls: ['./add-post-function-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AddPostFunctionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<TransitionPostFunction> {
  readonly form = this.fb.group<TransitionPostFunction>({} as TransitionPostFunction);
  readonly postFunctionTypes$ = this.adminWorkflowsService
    .select('postFunctionTypes')
    .pipe(
      map((types) =>
        types
          .filter((type) => this.context.data.items.every((item) => item.postFunctionType.id !== type.id))
          .concat(this.context.data.item ? [this.context.data.item.postFunctionType] : [])
      )
    );
  model = { values: [{}] } as TransitionPostFunction;
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
          const formControl = field?.formControl as FormControl<TransitionOption<PostFunctionType>>;
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
              serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
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
              label: 'emailTemplate',
              labelClassName: 'font-semibold',
              placeholder: 'chooseEmailTemplate',
              required: true,
              options: this.emailTemplatesQuery.selectAll(),
              matcherBy: 'id',
              labelProp: 'name',
            },
            hideExpression: (model, formState) =>
              ![
                PostFunctionType.SendEmailAndNotificationToTheLeaderWithASpecifiedTitle,
                PostFunctionType.SendEmailAndNotificationToTheNewAssignee,
                PostFunctionType.SendEmailAndNotificationToTheReporter,
              ].includes(formState.postFunctionTypeCode),
          },
        ],
      },
    },
  ];

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionPostFunction, TransitionOptionsDialogData<TransitionPostFunction>>,
    readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly actions: Actions,
    private readonly emailTemplatesQuery: EmailTemplatesQuery,
    private readonly destroy$: TuiDestroyService
  ) {
    super(fb, context, adminWorkflowsService);
    this.actions.dispatch(loadJobTitles());
    this.actions.dispatch(loadEmailTemplates());
  }
}
