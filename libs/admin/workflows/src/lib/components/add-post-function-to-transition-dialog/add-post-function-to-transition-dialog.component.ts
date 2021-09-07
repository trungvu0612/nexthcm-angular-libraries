import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { JobTitlesQuery, loadJobTitles } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs/operators';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { PostFunctionType } from '../../enums';
import { TransitionOption, TransitionOptionsDialogData, TransitionPostFunction } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-add-post-function-to-transition-dialog',
  templateUrl: './add-post-function-to-transition-dialog.component.html',
  styleUrls: ['./add-post-function-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostFunctionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<
  PostFunctionType,
  TransitionPostFunction
> {
  fields: FormlyFieldConfig[] = [
    {
      key: 'postFunctionType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.adminWorkflowsService
          .select('postFunctionTypes')
          .pipe(
            map((types) =>
              types.filter((type) => this.context.data.items.every((item) => item.postFunctionType.id !== type.id))
            )
          ),
        required: true,
      },
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
        serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
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
    readonly context: TuiDialogContext<
      TransitionOption<PostFunctionType>,
      TransitionOptionsDialogData<PostFunctionType, TransitionPostFunction>
    >,
    readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly actions: Actions
  ) {
    super(fb, context, adminWorkflowsService);
    this.actions.dispatch(loadJobTitles());
  }
}
