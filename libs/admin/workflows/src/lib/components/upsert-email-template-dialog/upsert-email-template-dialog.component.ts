import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { EmailTemplate } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-upsert-email-template-dialog',
  templateUrl: './upsert-email-template-dialog.component.html',
  styleUrls: ['./upsert-email-template-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertEmailTemplateDialogComponent implements OnInit {
  form = this.fb.group({} as EmailTemplate);
  model = {} as EmailTemplate;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'enterName',
        required: true,
      },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.data?.name === name ? of(true) : this.adminWorkflowsService.checkEmailTemplateName({ name })
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
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
      key: 'subjectDelta',
      className: 'tui-form__row block',
      type: 'quill-template-variables',
      templateOptions: {
        translate: true,
        label: 'subject',
        required: true,
        quillModules: { toolbar: false },
        maxlength: 255,
        onTextChange: (value: string) => this.form.controls['subject'].setValue(value),
        variables: this.adminWorkflowsService.emailVariables$,
      },
    },
    { key: 'subject' },
    {
      key: 'bodyDelta',
      className: 'tui-form__row block',
      type: 'quill-template-variables',
      templateOptions: {
        translate: true,
        label: 'content',
        required: true,
        height: '150px',
        onTextChange: (value: string) => this.form.controls['body'].setValue(value),
        variables: this.adminWorkflowsService.emailVariables$,
      },
    },
    { key: 'body' },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, EmailTemplate>,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    adminWorkflowsService.doLoadEmailVariables();
  }

  get data(): EmailTemplate {
    return this.context.data;
  }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.data,
        statusBoolean: this.data.status === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      (formModel.id
        ? this.adminWorkflowsService.updateEmailTemplate(formModel)
        : this.adminWorkflowsService.createEmailTemplate(formModel)
      )
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('', () => this.context.completeWith(true)));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
