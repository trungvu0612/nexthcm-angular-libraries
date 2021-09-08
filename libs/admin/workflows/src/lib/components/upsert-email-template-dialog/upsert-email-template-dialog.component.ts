import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EmailTemplate } from '../../models';

@Component({
  selector: 'hcm-upsert-email-template-dialog',
  templateUrl: './upsert-email-template-dialog.component.html',
  styleUrls: ['./upsert-email-template-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    },
    {
      key: 'status',
      className: 'tui-form__row block',
      type: 'toggle',
      defaultValue: true,
      templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('status'),
        'templateOptions.description': this.form?.valueChanges.pipe(
          startWith(null),
          map((value) => value?.status),
          distinctUntilChanged(),
          switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
        ),
      },
    },
    {
      key: 'delta',
      className: 'tui-form__row block',
      type: 'quill-template-variable',
      templateOptions: {
        translate: true,
        label: 'template',
        required: true,
        onTextChange: (value: string) => {
          this.form.controls.template.setValue(value);
        },
      },
    },
    { key: 'template' },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, EmailTemplate>,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(JSON.stringify(this.form.value));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
