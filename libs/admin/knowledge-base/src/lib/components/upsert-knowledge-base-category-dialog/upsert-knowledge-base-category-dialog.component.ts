import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseCategory } from '@nexthcm/knowledge-base';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';

@Component({
  selector: 'hcm-upsert-knowledge-base-category-dialog',
  templateUrl: './upsert-knowledge-base-category-dialog.component.html',
  styleUrls: ['./upsert-knowledge-base-category-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertKnowledgeBaseCategoryDialogComponent implements OnInit {
  form = this.fb.group<KnowledgeBaseCategory>({} as KnowledgeBaseCategory);
  model = {} as KnowledgeBaseCategory;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
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
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    { key: 'id' },
    { key: 'userCreatedBy' },
  ];

  constructor(
    private readonly translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, KnowledgeBaseCategory>,
    private readonly fb: FormBuilder,
    private readonly adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
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
      const formModel = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.adminKnowledgeBaseService
        .upsertKnowledgeBaseCategory(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            formModel.id ? 'updateCategorySuccessfully' : 'createCategorySuccessfully',
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
