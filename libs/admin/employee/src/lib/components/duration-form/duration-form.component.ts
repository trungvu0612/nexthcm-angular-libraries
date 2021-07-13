import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EmployeeDuration } from '../../models/employee';

@Component({
  selector: 'hcm-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationFormComponent {
  form = this.fb.group<EmployeeDuration>({});
  model: EmployeeDuration = { emergencyContacts: [{}] };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'onboardingDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'onboardingDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterOnboardingDate',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationDates',
              className: 'tui-form__row block',
              type: 'input-date-range',
              templateOptions: {
                translate: true,
                label: 'probationDates',
                labelClassName: 'font-semibold',
                placeholder: 'enterProbationDates',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'terminationDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'terminationDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterTerminationDate',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'probationNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterProbationNumber',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'emergencyContacts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'emergencyContactList',
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'phoneNumber',
                    type: 'input-number',
                    templateOptions: {
                      translate: true,
                      label: 'phoneNumber',
                      placeholder: 'enterPhoneNumber',
                      textfieldLabelOutside: true,
                    },
                  },
                  {
                    key: 'relationship',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: 'relationship',
                      placeholder: 'enterRelationship',
                      textfieldLabelOutside: true,
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'labourContractNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'labourContractNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterLabourContractNumber',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'labourContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'labourContractDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterLabourContractDate',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContract',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'indefiniteTermContract',
                labelClassName: 'font-semibold',
                placeholder: 'enterIndefiniteTermContract',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'indefiniteTermContractDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterIndefiniteTermContractDate',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreement',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'resignationAgreement',
                labelClassName: 'font-semibold',
                placeholder: 'enterResignationAgreement',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreementDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'resignationAgreementDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterResignationAgreementDate',
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
  ];

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log(JSON.stringify(this.form.value));
  }
}
