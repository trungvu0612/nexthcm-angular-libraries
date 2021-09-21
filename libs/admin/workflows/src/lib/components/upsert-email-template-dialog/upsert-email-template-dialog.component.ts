import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { EmailTemplate } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadTemplateVariables } from '../../state';

@Component({
  selector: 'hcm-upsert-email-template-dialog',
  templateUrl: './upsert-email-template-dialog.component.html',
  styleUrls: ['./upsert-email-template-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertEmailTemplateDialogComponent implements OnInit {
  form = this.fb.group<EmailTemplate>({} as EmailTemplate);
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
        shortname: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : of(control.value).pipe(
                  delay(500),
                  filter((name) => !this.data || this.data.name !== name),
                  switchMap((name: string) => this.adminWorkflowsService.checkEmailTemplateName({ name }))
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.emailTemplateNameExists'),
        },
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'toggle',
      defaultValue: true,
      templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('status'),
        'templateOptions.description': this.form?.valueChanges.pipe(
          startWith(null),
          map((value) => value?.statusBoolean),
          distinctUntilChanged(),
          switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
        ),
      },
    },
    {
      key: 'subject',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        textfieldLabelOutside: true,
        translate: true,
        label: 'subject',
        labelClassName: 'font-semibold',
        placeholder: 'enterSubject',
        required: true,
      },
    },
    {
      key: 'delta',
      className: 'tui-form__row block',
      type: 'quill-template-variable',
      templateOptions: {
        translate: true,
        label: 'content',
        required: true,
        onTextChange: (value: string) => this.form.controls.body.setValue(value),
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
    private readonly promptService: PromptService,
    actions: Actions
  ) {
    actions.dispatch(loadTemplateVariables());
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
