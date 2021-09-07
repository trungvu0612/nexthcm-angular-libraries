import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EmailTemplate } from '../../models';

@Component({
  selector: 'hcm-upsert-email-template',
  templateUrl: './upsert-email-template.component.html',
  styleUrls: ['./upsert-email-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEmailTemplateComponent {
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
      },
    },
    { key: 'template' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      //
    }
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
  }
}
