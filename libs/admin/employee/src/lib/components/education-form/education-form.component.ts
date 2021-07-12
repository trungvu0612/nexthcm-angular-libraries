import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EmployeeEducation } from '../../models/employee';

@Component({
  selector: 'hcm-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationFormComponent {
  form = this.fb.group<EmployeeEducation>({});
  model: EmployeeEducation = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'university',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'university',
        labelClassName: 'font-semibold',
        placeholder: 'enterUniversity',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'major',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'major',
        labelClassName: 'font-semibold',
        placeholder: 'enterMajor',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'highestCertificate',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'highestCertificate',
        labelClassName: 'font-semibold',
        placeholder: 'enterHighestCertificate',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'graduationYear',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        label: 'graduationYear',
        labelClassName: 'font-semibold',
        placeholder: 'enterGraduationYear',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'editor',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log(JSON.stringify(this.form.value));
  }
}
