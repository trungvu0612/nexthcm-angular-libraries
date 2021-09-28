import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import {
  AddressService,
  BaseOption,
  EmployeeCurrentStatus,
  EmployeeIndividual,
  EmployeesService,
  loadOffices,
  OfficesQuery,
  parseDateFields,
  parseTuiDayFields,
  PromptService,
} from '@nexthcm/cdk';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
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
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'permanentAddressPersonal',
              className: 'tui-form__row block',
              fieldGroup: [
                {
                  key: 'address',
                  className: 'tui-form__row block',
                  type: 'input',
                  templateOptions: {
                    translate: true,
                    label: 'permanentAddress',
                    labelClassName: 'font-semibold',
                    placeholder: 'enterPermanentAddress',
                    textfieldLabelOutside: true,
                    translocoScope: this.scope,
                  },
                },
                {
                  className: 'tui-form__row block',
                  fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
                  fieldGroup: [
                    {
                      key: 'countryId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'country',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseCountry',
                        options: this.addressService.select('countries'),
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                    },
                    {
                      key: 'cityId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'province',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseProvince',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const countryControl = this.form.get(
                            'permanentAddressPersonal.countryId'
                          ) as FormControl<string>;
                          if (field?.templateOptions && countryControl) {
                            field.templateOptions.options = countryControl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(countryControl.value),
                              switchMap((countryId) => (countryId ? this.addressService.getPlaces(countryId) : of([]))),
                              startWith([])
                            );
                          }
                        },
                      },
                    },
                  ],
                },
                {
                  className: 'tui-form__row block',
                  fieldGroupClassName: 'grid grid-cols-2 gap-x-4 tui-form__row',
                  fieldGroup: [
                    {
                      key: 'districtId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'district',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseDistrict',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const cityControl = this.form.get('permanentAddressPersonal.cityId') as FormControl<string>;
                          if (field?.templateOptions && cityControl)
                            field.templateOptions.options = cityControl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(cityControl.value),
                              switchMap((cityId) => (cityId ? this.addressService.getPlaces(cityId) : of([]))),
                              startWith([])
                            );
                        },
                      },
                    },
                    {
                      key: 'wardId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'ward',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseWard',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const districtCtrl = this.form.get(
                            'permanentAddressPersonal.districtId'
                          ) as FormControl<string>;
                          if (field?.templateOptions && districtCtrl)
                            field.templateOptions.options = districtCtrl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(districtCtrl.value),
                              switchMap((districtId) =>
                                districtId ? this.addressService.getPlaces(districtId) : of([])
                              ),
                              startWith([])
                            );
                        },
                      },
                    },
                    {
                      key: 'postalCode',
                      className: 'tui-form__row block',
                      type: 'input',
                      templateOptions: {
                        translate: true,
                        label: 'postalCode',
                        labelClassName: 'font-semibold',
                        placeholder: 'enterPostalCode',
                        textfieldLabelOutside: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              key: 'temporaryAddressPersonal',
              className: 'tui-form__row block',
              fieldGroup: [
                {
                  key: 'address',
                  className: 'tui-form__row block',
                  type: 'input',
                  templateOptions: {
                    translate: true,
                    label: 'temporaryAddress',
                    labelClassName: 'font-semibold',
                    placeholder: 'enterTemporaryAddress',
                    textfieldLabelOutside: true,
                    translocoScope: this.scope,
                  },
                },
                {
                  className: 'tui-form__row block',
                  fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
                  fieldGroup: [
                    {
                      key: 'countryId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'country',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseCountry',
                        options: this.addressService.select('countries'),
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                    },
                    {
                      key: 'cityId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'province',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseProvince',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const countryControl = this.form.get(
                            'temporaryAddressPersonal.countryId'
                          ) as FormControl<string>;
                          if (field?.templateOptions && countryControl) {
                            field.templateOptions.options = countryControl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(countryControl.value),
                              switchMap((countryId) => (countryId ? this.addressService.getPlaces(countryId) : of([]))),
                              startWith([])
                            );
                          }
                        },
                      },
                    },
                  ],
                },
                {
                  className: 'tui-form__row block',
                  fieldGroupClassName: 'grid grid-cols-2 gap-x-4 tui-form__row',
                  fieldGroup: [
                    {
                      key: 'districtId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'district',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseDistrict',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const cityControl = this.form.get('temporaryAddressPersonal.cityId') as FormControl<string>;
                          if (field?.templateOptions && cityControl)
                            field.templateOptions.options = cityControl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(cityControl.value),
                              switchMap((cityId) => (cityId ? this.addressService.getPlaces(cityId) : of([]))),
                              startWith([])
                            );
                        },
                      },
                    },
                    {
                      key: 'wardId',
                      type: 'select',
                      templateOptions: {
                        translate: true,
                        label: 'ward',
                        labelClassName: 'font-semibold',
                        placeholder: 'chooseWard',
                        valueProp: 'id',
                        labelProp: 'name',
                      },
                      hooks: {
                        onInit: (field) => {
                          const districtCtrl = this.form.get(
                            'temporaryAddressPersonal.districtId'
                          ) as FormControl<string>;
                          if (field?.templateOptions && districtCtrl)
                            field.templateOptions.options = districtCtrl.valueChanges.pipe(
                              tap(() => field.formControl?.setValue(null)),
                              startWith(districtCtrl.value),
                              switchMap((districtId) =>
                                districtId ? this.addressService.getPlaces(districtId) : of([])
                              ),
                              startWith([])
                            );
                        },
                      },
                    },
                    {
                      key: 'postalCode',
                      className: 'tui-form__row block',
                      type: 'input',
                      templateOptions: {
                        translate: true,
                        label: 'postalCode',
                        labelClassName: 'font-semibold',
                        placeholder: 'enterPostalCode',
                        textfieldLabelOutside: true,
                      },
                    },
                  ],
                },
              ],
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
              },
            },
            {
              key: 'nationality',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: 'nationality',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterNationality',
                translocoScope: this.scope,
              },
            },
            {
              key: 'section',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: 'section',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterSection',
                translocoScope: this.scope,
              },
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                translocoScope: this.scope,
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
                options: this.officesQuery.selectAll(),
                placeholder: 'chooseOffice',
                labelProp: 'name',
                matcherBy: 'id',
                translocoScope: this.scope,
              },
            },
            {
              key: 'gender',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'gender',
                labelClassName: 'font-semibold',
                placeholder: 'chooseGender',
                valueProp: 'value',
                translocoScope: this.scope,
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>('GENDER_OPTIONS', {}, (this.scope as ProviderScope).scope)
                  .pipe(
                    map(
                      (result) =>
                        [
                          { value: 'MALE', label: result.male },
                          { value: 'FEMALE', label: result.female },
                          { value: 'OTHER', label: result.other },
                        ] as BaseOption<string>[]
                    )
                  ),
              },
            },
            {
              key: 'maritalStatus',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'maritalStatus',
                labelClassName: 'font-semibold',
                placeholder: 'chooseMaritalStatus',
                valueProp: 'value',
                translocoScope: this.scope,
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>(
                    'MARITAL_STATUS_OPTIONS',
                    {},
                    (this.scope as ProviderScope).scope
                  )
                  .pipe(
                    map(
                      (result) =>
                        [
                          { value: 'Married', label: result.married },
                          { value: 'Widowed', label: result.widowed },
                          { value: 'Seperated', label: result.seperated },
                          { value: 'Divorced', label: result.divorced },
                          { value: 'Single', label: result.single },
                        ] as BaseOption<string>[]
                    )
                  ),
              },
            },
            {
              key: 'religion',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: 'religion',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'enterReligion',
                translocoScope: this.scope,
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
                translocoScope: this.scope,
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>('INDIVIDUAL_STATUS', {}, (this.scope as ProviderScope).scope)
                  .pipe(
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
                translocoScope: this.scope,
              },
              hideExpression: (model: EmployeeIndividual) => model.currentStatus !== EmployeeCurrentStatus.Onsite,
            },
            {
              key: 'bankAccounts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: 'bankAccountList',
                translocoScope: this.scope,
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
                      translocoScope: this.scope,
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
                      translocoScope: this.scope,
                    },
                  },
                ],
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
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'individual')
    .pipe(
      tap((res) => {
        const data = parseTuiDayFields(res, ['birthDate', 'issueOn']);

        this.model = {
          ...this.model,
          ...data,
          employeeId: this.activatedRoute.snapshot.params.employeeId,
          type: 'individual',
        };
      }),
      startWith(null),
      share()
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly addressService: AddressService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly officesQuery: OfficesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadOffices());
  }

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
