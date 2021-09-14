import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeSHUI, EmployeesService, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { map, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-shui-form',
  templateUrl: './shui-form.component.html',
  styleUrls: ['./shui-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ShuiFormComponent {
  form: FormGroup<EmployeeSHUI> = this.fb.group({} as EmployeeSHUI);
  model = { healthCares: [{}] } as EmployeeSHUI;
  fields: FormlyFieldConfig[] = [
    { key: 'employeeId', defaultValue: this.activatedRoute.snapshot.params.employeeId },
    { key: 'type', defaultValue: 'SHUI' },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'taxIDNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'taxIDNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterTaxIDNumber',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'socialInsuranceNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'socialInsuranceNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterSocialInsuranceNumber',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'socialInsurancePlace',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'socialInsurancePlace',
                labelClassName: 'font-semibold',
                placeholder: 'enterSocialInsurancePlace',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthCares',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'healthCareInsuranceList',
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'healthCareCompany',
                    type: 'select',
                    defaultValue: 'PVI',
                    templateOptions: {
                      translate: true,
                      label: 'healthCareCompany',
                      placeholder: 'chooseHealthCareCompany',
                      options: ['PVI'],
                    },
                  },
                  {
                    key: 'number',
                    type: 'input-number',
                    templateOptions: {
                      translate: true,
                      label: 'healthCareNumber',
                      placeholder: 'enterHealthCareNumber',
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
              key: 'familyHealthyCareNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'familyHealthCarePackageNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterFamilyHealthCarePackageNumber',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'familyAllowance',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'familyAllowance',
                labelClassName: 'font-semibold',
                placeholder: 'enterFamilyAllowance',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'healthInsuranceNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'healthInsuranceNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterHealthInsuranceNumber',
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'shui')
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminEmployeeService: AdminEmployeesService,
    private employeesService: EmployeesService,
    private destroy$: TuiDestroyService,
    private promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeSHUI>(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
