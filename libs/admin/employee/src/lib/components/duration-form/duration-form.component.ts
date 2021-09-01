import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DateRange,
  EmployeeDuration,
  EmployeesService,
  parseDateFields,
  parseTuiDayFields,
  PromptService,
} from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class DurationFormComponent {
  form: FormGroup<EmployeeDuration> = this.fb.group({} as EmployeeDuration);
  model = { emergencyContacts: [{}] } as EmployeeDuration;
  fields: FormlyFieldConfig[] = [
    { key: 'employeeId', defaultValue: this.activatedRoute.snapshot.params.employeeId },
    { key: 'type', defaultValue: 'DURATION' },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'onboardDate',
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
              key: 'probationDate',
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
              key: 'officialStartDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: 'officialStartDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterOfficialStartDate',
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
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'duration')
    .pipe(
      tap((res) => {
        const data = parseTuiDayFields(res, [
          'onboardDate',
          'officialStartDate',
          'terminationDate',
          'labourContractDate',
          'indefiniteTermContractDate',
          'resignationAgreementDate',
        ]);
        data.probationDate = data.probationDate
          ? DateRange.toTuiDayRange(data.probationDate as DateRange)
          : undefined;
        this.model = { ...this.model, ...data };
      })
    );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeeService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = parseDateFields(this.form.value, [
        'onboardDate',
        'officialStartDate',
        'terminationDate',
        'labourContractDate',
        'indefiniteTermContractDate',
        'resignationAgreementDate',
      ]);

      formModel.probationDate = new DateRange(formModel.probationDate as TuiDayRange);
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeDuration>(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
