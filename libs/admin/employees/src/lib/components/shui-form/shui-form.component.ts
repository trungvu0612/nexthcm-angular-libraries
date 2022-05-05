import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeSHUI, EmployeesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-shui-form',
  templateUrl: './shui-form.component.html',
  styleUrls: ['./shui-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ShuiFormComponent {
  form = this.fb.group({} as EmployeeSHUI);
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
                label: `${this.translocoScope.scope}.socialInsuranceNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSocialInsuranceNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'socialInsurancePlace',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.socialInsurancePlace`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSocialInsurancePlace`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthCares',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.healthCareInsuranceList`,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'healthcare',
                    type: 'select',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.healthCareCompany`,
                      placeholder: `${this.translocoScope.scope}.chooseHealthCareCompany`,
                      options: ['PVI'],
                      textfieldLabelOutside: false,
                    },
                  },
                  {
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.healthCareNumber`,
                      placeholder: `${this.translocoScope.scope}.enterHealthCareNumber`,
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
                label: `${this.translocoScope.scope}.taxIDNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterTaxIDNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'familyHealthyCareNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.familyHealthCarePackageNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterFamilyHealthCarePackageNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthInsuranceNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.healthInsuranceNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterHealthInsuranceNumber`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthInsurancePlace',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.healthInsurancePlace`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterHealthInsurancePlace`,
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
        label: `${this.translocoScope.scope}.dependentMembers`,
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
              label: `${this.translocoScope.scope}.DOB`,
              placeholder: `${this.translocoScope.scope}.enterDOB`,
            },
          },
          {
            key: 'idNumberDependenceMember',
            type: 'input',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.idNumber`,
              placeholder: `${this.translocoScope.scope}.enterIDNumber`,
            },
          },
          {
            key: 'issueOnDependenceMember',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.issueOn`,
              placeholder: `${this.translocoScope.scope}.enterIssueOn`,
            },
          },
          {
            key: 'issueAtDependenceMember',
            type: 'input',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.issueAt`,
              placeholder: `${this.translocoScope.scope}.enterIssueAt`,
            },
          },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'SHUI')
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
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
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeSHUI>(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessfully'));
    }
  }
}
