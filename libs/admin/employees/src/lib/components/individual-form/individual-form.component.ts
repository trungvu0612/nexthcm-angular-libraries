import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseOption,
  EmployeeCurrentStatus,
  EmployeeIndividual,
  EmployeesService,
  parseDateFields,
  parseTuiDayFields,
  PromptService,
} from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-individual-form',
  templateUrl: './individual-form.component.html',
  styleUrls: ['./individual-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class IndividualFormComponent {
  form: FormGroup<EmployeeIndividual> = this.fb.group({} as EmployeeIndividual);
  model = { bankAccounts: [{}] } as EmployeeIndividual;
  fields: FormlyFieldConfig[] = [
    { key: 'employeeId', defaultValue: this.activatedRoute.snapshot.params.employeeId },
    { key: 'type', defaultValue: 'INDIVIDUAL' },
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
              type: 'input-date',
              templateOptions: {
                translate: true,
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
                label: 'currentStatus',
                labelClassName: 'font-semibold',
                placeholder: 'chooseCurrentStatus',
                valueProp: 'value',
                options: this.translocoService.selectTranslateObject<{ [p: string]: string }>('INDIVIDUAL_STATUS').pipe(
                  map(
                    (result) =>
                      [
                        { value: EmployeeCurrentStatus.Working, label: result.working },
                        { value: EmployeeCurrentStatus.Onsite, label: result.onsite },
                        { value: EmployeeCurrentStatus.Probation, label: result.probation },
                        { value: EmployeeCurrentStatus.Maternity, label: result.maternity },
                        { value: EmployeeCurrentStatus.WorkFromHome, label: result.wfh },
                      ] as BaseOption<EmployeeCurrentStatus>[]
                  )
                ),
              },
            },
            {
              key: 'officeOnsite',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'officeOnsite',
                labelClassName: 'font-semibold',
                placeholder: 'chooseOfficeOnsite',
                textfieldLabelOutside: true,
              },
              hideExpression: (model: EmployeeIndividual) => model.currentStatus !== EmployeeCurrentStatus.Onsite,
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
              validators: { validation: [RxwebValidators.email()] },
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
              validators: { validation: [RxwebValidators.email()] },
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
                options: this.adminEmployeeService.select('offices'),
                placeholder: 'chooseOffice',
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'bankAccounts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'bankAccountList',
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'bank',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: 'bank',
                      placeholder: 'selectBank',
                      textfieldLabelOutside: true,
                    },
                  },
                  {
                    key: 'number',
                    type: 'input-number',
                    templateOptions: {
                      translate: true,
                      label: 'accountNumber',
                      placeholder: 'enterAccountNumber',
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
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'individual')
    .pipe(
      tap((res) => {
        const data = parseTuiDayFields(res, ['birthDate', 'issueOn']);
        this.model = { ...this.model, ...data };
      }),
      startWith(null),
      share()
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService,
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
        .updateEmployeeInformation<EmployeeIndividual>(parseDateFields(this.form.value, ['birthDate', 'issueOn']))
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
