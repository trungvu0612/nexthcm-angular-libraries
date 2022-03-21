import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  DateRange,
  EmployeeDuration,
  EmployeesService,
  parseDateFields,
  parseTuiDayFields,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-duration-form',
  templateUrl: './duration-form.component.html',
  styleUrls: ['./duration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class DurationFormComponent {
  form = this.fb.group({} as EmployeeDuration);
  model = { emergencyContacts: [{}] } as EmployeeDuration;
  fields: FormlyFieldConfig[] = [
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
                label: `${this.translocoScope.scope}.onboardingDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterOnboardingDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationDate',
              className: 'tui-form__row block',
              type: 'input-date-range',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.probationDates`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterProbationDates`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'officialStartDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.officialStartDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterOfficialStartDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'terminationDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.terminationDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterTerminationDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.probationNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterProbationNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'emergencyContacts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.emergencyContactList`,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'phoneNumber',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: 'phoneNumber',
                      placeholder: 'enterPhoneNumber',
                    },
                  },
                  {
                    key: 'relationship',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.relationship`,
                      placeholder: `${this.translocoScope.scope}.enterRelationship`,
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
                label: `${this.translocoScope.scope}.labourContractNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterLabourContractNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'labourContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.labourContractDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterLabourContractDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContract',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.indefiniteTermContract`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterIndefiniteTermContract`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.indefiniteTermContractDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterIndefiniteTermContractDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreement',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.resignationAgreement`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterResignationAgreement`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreementDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.resignationAgreementDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterResignationAgreementDate`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    { key: 'employeeId' },
    { key: 'type', defaultValue: 'DURATION' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'DURATION')
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

        if (data.probationDate) {
          const { from, to } = data.probationDate as { from: string; to: string };

          data.probationDate = DateRange.toTuiDayRange(new DateRange(from, to));
        } else {
          delete data.probationDate;
        }
        return (this.model = { ...this.model, ...data });
      })
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
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

      if (formModel.probationDate) {
        formModel.probationDate = DateRange.fromTuiDayRange(formModel.probationDate as TuiDayRange);
      }
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeDuration>(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
