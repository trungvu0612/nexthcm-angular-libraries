import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { PostFunctionType } from '../../enums';
import { TransitionOption, TransitionPostFunction } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

@Component({
  selector: 'hcm-add-post-function-to-transition-dialog',
  templateUrl: './add-post-function-to-transition-dialog.component.html',
  styleUrls: ['./add-post-function-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostFunctionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<PostFunctionType> {
  fields: FormlyFieldConfig[] = [
    {
      key: 'validatorType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.adminWorkflowService.select('postFunctionTypes'),
        required: true,
      },
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'users',
        labelClassName: 'font-semibold',
        required: true,
        options: [],
      },
      hideExpression: (model: TransitionPostFunction) =>
        ![
          PostFunctionType.SendEmailAndNotificationToTheLeaderWithASpecifiedTitle,
          PostFunctionType.AssignToTheNearestLeaderWithASpecifiedTitle,
        ].includes(model.postFunctionType?.code),
    },
  ];

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionOption<PostFunctionType>, TransitionOption<PostFunctionType>>,
    readonly adminWorkflowService: AdminWorkflowService
  ) {
    super(fb, context, adminWorkflowService);
  }
}
