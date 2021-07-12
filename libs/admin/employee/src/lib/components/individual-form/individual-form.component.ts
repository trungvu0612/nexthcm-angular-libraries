import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseOption } from '@nexthcm/ui';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { map } from 'rxjs/operators';
import { EmployeeIndividual } from '../../models/employee';

@Component({
  selector: 'hcm-individual-form',
  templateUrl: './individual-form.component.html',
  styleUrls: ['./individual-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualFormComponent {
  form = this.fb.group<EmployeeIndividual>({});
  model: EmployeeIndividual = { bankAccounts: [{}] };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'permanentAddress',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'permanentAddress',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterPermanentAddress',
              },
            },
            {
              key: 'temporaryAddress',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'temporaryAddress',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterTemporaryAddress',
              },
            },
            {
              key: 'birthDate',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                label: 'DOB',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterDOB',
              },
            },
            {
              key: 'idNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'idNumber',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterIDNumber',
              },
            },
            {
              key: 'issueOn',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'issueOn',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterIssueOn',
              },
            },
            {
              key: 'issueAt',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'issueAt',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterIssueAt',
              },
            },
            {
              key: 'currentStatus',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'permanentAddress',
                labelClassName: 'font-semibold',
                placeholder: 'chooseCurrentStatus',
                options: this.translocoService.selectTranslateObject<{ [p: string]: string }>('INDIVIDUAL_STATUS').pipe(
                  map(
                    (result) =>
                      [
                        { value: 0, label: result.working },
                        { value: 1, label: result.onsite },
                        { value: 2, label: result.probation },
                        { value: 3, label: result.wfh },
                      ] as BaseOption<number>[]
                  )
                ),
              },
            },
            {
              key: 'officeOnsite',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'officeOnsite',
                labelClassName: 'font-semibold',
                placeholder: 'chooseOffice',
                options: [],
              },
              hideExpression: 'model.currentStatus !== 1',
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'companyEmail',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'companyEmail',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterCompanyEmail',
              },
              validators: {
                validation: [RxwebValidators.email()],
              },
            },
            {
              key: 'personalEmail',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'personalEmail',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterPersonalEmail',
              },
              validators: {
                validation: [RxwebValidators.email()],
              },
            },
            {
              key: 'phoneNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'phoneNumber',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterPhoneNumber',
              },
            },
            {
              key: 'office',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'office',
                labelClassName: 'font-semibold',
                options: [],
                placeholder: 'chooseOffice',
              },
            },
            {
              key: 'bankAccounts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'bankAccounts',
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'bank',
                    type: 'select',
                    templateOptions: {
                      translate: true,
                      label: 'bank',
                      labelClassName: 'font-semibold',
                      options: [],
                      placeholder: 'enterBank',
                    },
                  },
                  {
                    key: 'bankNumber',
                    type: 'input-number',
                    templateOptions: {
                      translate: true,
                      label: 'bankNumber',
                      labelClassName: 'font-semibold',
                      placeholder: 'enterBankNumber',
                      textfieldLabelOutside: true,
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ];

  constructor(private fb: FormBuilder, private translocoService: TranslocoService) {}

  onSubmit(): void {
    console.log(JSON.stringify(this.form.value));
  }
}
