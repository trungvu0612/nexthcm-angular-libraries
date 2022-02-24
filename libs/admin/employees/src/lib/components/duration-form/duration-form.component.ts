import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { cacheable } from '@datorama/akita';
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
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeDurationQuery, EmployeeDurationStore, EmployeeQuery } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

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
                label: `${TRANSLATION_SCOPE}.onboardingDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterOnboardingDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationDate',
              className: 'tui-form__row block',
              type: 'input-date-range',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.probationDates`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterProbationDates`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'officialStartDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.officialStartDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterOfficialStartDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'terminationDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.terminationDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterTerminationDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'probationNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.probationNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterProbationNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'emergencyContacts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.emergencyContactList`,
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
                      label: `${TRANSLATION_SCOPE}.relationship`,
                      placeholder: `${TRANSLATION_SCOPE}.enterRelationship`,
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
                label: `${TRANSLATION_SCOPE}.labourContractNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterLabourContractNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'labourContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.labourContractDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterLabourContractDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContract',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.indefiniteTermContract`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterIndefiniteTermContract`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'indefiniteTermContractDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.indefiniteTermContractDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterIndefiniteTermContractDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreement',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.resignationAgreement`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterResignationAgreement`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'resignationAgreementDate',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.resignationAgreementDate`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterResignationAgreementDate`,
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
  private readonly request$ = this.employeeDurationQuery
    .select()
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly employeeDurationQuery: EmployeeDurationQuery,
    private readonly employeeDurationStore: EmployeeDurationStore,
    employeeQuery: EmployeeQuery
  ) {
    cacheable(
      this.employeeDurationStore,
      this.employeesService.getEmployeeInformation(employeeQuery.getValue().id, 'DURATION').pipe(
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

          this.employeeDurationStore.update(data);
          this.employeeDurationStore.setHasCache(true);
        })
      )
    ).subscribe();
  }

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
        .pipe(
          tap(() => this.employeeDurationStore.update(this.form.value)),
          takeUntil(this.destroy$)
        )
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
