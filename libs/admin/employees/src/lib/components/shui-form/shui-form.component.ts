import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeSHUI, EmployeesService, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, takeUntil, tap } from 'rxjs/operators';
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
              },
            },
            {
              key: 'healthCares',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'healthCareInsuranceList',
                translocoScope: this.scope,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'healthcare',
                    type: 'select',
                    defaultValue: 'PVI',
                    templateOptions: {
                      translate: true,
                      label: 'healthCareCompany',
                      placeholder: 'chooseHealthCareCompany',
                      translocoScope: this.scope,
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
              key: 'familyHealthyCareNumber',
              className: 'tui-form__row block',
              type: 'input-number',
              templateOptions: {
                translate: true,
                label: 'familyHealthCarePackageNumber',
                labelClassName: 'font-semibold',
                placeholder: 'enterFamilyHealthCarePackageNumber',
                textfieldLabelOutside: true,
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
              },
            },
          ],
        },
      ],
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'SHUI')
    .pipe(
      tap(
        (data) =>
          (this.model = {
            ...this.model,
            ...data,
            employeeId: this.activatedRoute.snapshot.params.employeeId,
            type: 'SHUI',
          })
      ),
      startWith(null),
      share()
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
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
