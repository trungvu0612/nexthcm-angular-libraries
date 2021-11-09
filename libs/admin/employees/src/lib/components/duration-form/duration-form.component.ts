import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
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
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeDurationQuery, EmployeeDurationStore, EmployeeQuery } from '../../state';

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
                label: 'onboardingDate',
                labelClassName: 'font-semibold',
                placeholder: 'enterOnboardingDate',
                textfieldLabelOutside: true,
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
              },
            },
            {
              key: 'probationNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'probationNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterProbationNumber',
                textfieldLabelOutside: true,
                translocoScope: this.scope,
              },
            },
            {
              key: 'emergencyContacts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'emergencyContactList',
                translocoScope: this.scope,
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
                      label: 'relationship',
                      placeholder: 'enterRelationship',
                      translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
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

          data.probationDate = data.probationDate
            ? DateRange.toTuiDayRange(data.probationDate as DateRange)
            : undefined;
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
        formModel.probationDate = new DateRange(formModel.probationDate as TuiDayRange);
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
