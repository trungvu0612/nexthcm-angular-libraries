import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { cacheable } from '@datorama/akita';
import { EmployeeSHUI, EmployeesService, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeQuery, EmployeeSHUIQuery, EmployeeSHUIStore } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-shui-form',
  templateUrl: './shui-form.component.html',
  styleUrls: ['./shui-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ShuiFormComponent {
  form: FormGroup<EmployeeSHUI> = this.fb.group({} as EmployeeSHUI);
  model = { healthCares: [{}], dependenceMembers: [{}] } as EmployeeSHUI;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'socialInsuranceNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.socialInsuranceNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterSocialInsuranceNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'socialInsurancePlace',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.socialInsurancePlace`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterSocialInsurancePlace`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthCares',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.healthCareInsuranceList`,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'healthcare',
                    type: 'select',
                    templateOptions: {
                      translate: true,
                      label: `${TRANSLATION_SCOPE}.healthCareCompany`,
                      placeholder: `${TRANSLATION_SCOPE}.chooseHealthCareCompany`,
                      options: ['PVI'],
                      textfieldLabelOutside: false,
                    },
                  },
                  {
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${TRANSLATION_SCOPE}.healthCareNumber`,
                      placeholder: `${TRANSLATION_SCOPE}.enterHealthCareNumber`,
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
              key: 'taxIDNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.taxIDNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterTaxIDNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'familyHealthyCareNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.familyHealthCarePackageNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterFamilyHealthCarePackageNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthInsuranceNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.healthInsuranceNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterHealthInsuranceNumber`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      key: 'dependenceMembers',
      className: 'tui-form__row block',
      type: 'repeat',
      templateOptions: {
        translate: true,
        label: `${TRANSLATION_SCOPE}.dependentMembers`,
      },
      fieldArray: {
        fieldGroupClassName: 'grid grid-cols-5 gap-4',
        fieldGroup: [
          {
            key: 'nameDependenceMember',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'name',
              placeholder: 'enterName',
            },
          },
          {
            key: 'birthDateDependenceMember',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: `${TRANSLATION_SCOPE}.DOB`,
              placeholder: `${TRANSLATION_SCOPE}.enterDOB`,
            },
          },
          {
            key: 'idNumberDependenceMember',
            type: 'input',
            templateOptions: {
              translate: true,
              label: `${TRANSLATION_SCOPE}.idNumber`,
              placeholder: `${TRANSLATION_SCOPE}.enterIDNumber`,
            },
          },
          {
            key: 'issueOnDependenceMember',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: `${TRANSLATION_SCOPE}.issueOn`,
              placeholder: `${TRANSLATION_SCOPE}.enterIssueOn`,
            },
          },
          {
            key: 'issueAtDependenceMember',
            type: 'input',
            templateOptions: {
              translate: true,
              label: `${TRANSLATION_SCOPE}.issueAt`,
              placeholder: `${TRANSLATION_SCOPE}.enterIssueAt`,
            },
          },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeeSHUIQuery
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
    private readonly employeeSHUIQuery: EmployeeSHUIQuery,
    private readonly employeeSHUIStore: EmployeeSHUIStore,
    employeeQuery: EmployeeQuery
  ) {
    cacheable(
      this.employeeSHUIStore,
      this.employeesService.getEmployeeInformation(employeeQuery.getValue().id, 'SHUI').pipe(
        tap((res) => {
          this.employeeSHUIStore.update(res);
          this.employeeSHUIStore.setHasCache(true);
        })
      )
    ).subscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeSHUI>(this.form.value)
        .pipe(
          tap(() => this.employeeSHUIStore.update(this.form.value)),
          takeUntil(this.destroy$)
        )
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
