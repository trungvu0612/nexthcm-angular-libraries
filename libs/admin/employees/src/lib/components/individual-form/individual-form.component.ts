import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AddressService,
  BaseOption,
  EmployeeCurrentStatus,
  EmployeeIndividual,
  EmployeesService,
  OfficesService,
  parseDateFields,
  parseTuiDayFields,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-individual-form',
  templateUrl: './individual-form.component.html',
  styleUrls: ['./individual-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class IndividualFormComponent {
  form = this.fb.group({} as EmployeeIndividual);
  model = { bankAccounts: [{}] } as EmployeeIndividual;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'permanentAddress',
              className: 'tui-form__row block',
              fieldGroup: [
                {
                  key: 'address1',
                  className: 'tui-form__row block',
                  type: 'input',
                  templateOptions: {
                    translate: true,
                    label: `${this.translocoScope.scope}.permanentAddress`,
                    labelClassName: 'font-semibold',
                    placeholder: `${this.translocoScope.scope}.enterPermanentAddress`,
                    textfieldLabelOutside: true,
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
                          const countryControl = this.form.get('permanentAddress.countryId') as FormControl;
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
                          const cityControl = this.form.get('permanentAddress.cityId') as FormControl;
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
                          const districtCtrl = this.form.get('permanentAddress.districtId') as FormControl;
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
              key: 'temporaryAddress',
              className: 'tui-form__row block',
              fieldGroup: [
                {
                  key: 'address1',
                  className: 'tui-form__row block',
                  type: 'input',
                  templateOptions: {
                    translate: true,
                    label: `${this.translocoScope.scope}.temporaryAddress`,
                    labelClassName: 'font-semibold',
                    placeholder: `${this.translocoScope.scope}.enterTemporaryAddress`,
                    textfieldLabelOutside: true,
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
                          const countryControl = this.form.get('temporaryAddress.countryId') as FormControl;
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
                          const cityControl = this.form.get('temporaryAddress.cityId') as FormControl;
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
                          const districtCtrl = this.form.get('temporaryAddress.districtId') as FormControl;
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
                label: `${this.translocoScope.scope}.DOB`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterDOB`,
              },
            },
            {
              key: 'idNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.idNumber`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterIDNumber`,
              },
            },
            {
              key: 'issueOn',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.issueOn`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterIssueOn`,
              },
            },
            {
              key: 'issueAt',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.issueAt`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterIssueAt`,
              },
            },
            {
              key: 'nationality',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.nationality`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterNationality`,
              },
            },
            {
              key: 'section',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.section`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterSection`,
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
                label: `${this.translocoScope.scope}.companyEmail`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterCompanyEmail`,
              },
              validators: { validation: [RxwebValidators.email()] },
            },
            {
              key: 'personalEmail',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.personalEmail`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterPersonalEmail`,
              },
              validators: { validation: [RxwebValidators.email()] },
            },
            {
              key: 'phoneNumber',
              className: 'tui-form__row block',
              type: 'input',
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
                options: this.officesService.offices$,
                placeholder: 'chooseOffice',
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'gender',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.gender`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.chooseGender`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject('GENDER_OPTIONS', {}, this.translocoScope.scope)
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
                label: `${this.translocoScope.scope}.maritalStatus`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.chooseMaritalStatus`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject('MARITAL_STATUS_OPTIONS', {}, this.translocoScope.scope)
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
                label: `${this.translocoScope.scope}.religion`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterReligion`,
              },
            },
            {
              key: 'currentStatus',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.currentStatus`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.chooseCurrentStatus`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject('INDIVIDUAL_STATUS', {}, this.translocoScope.scope)
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
                label: `${this.translocoScope.scope}.officeOnsite`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.chooseOfficeOnsite`,
                textfieldLabelOutside: true,
              },
              hideExpression: (model: EmployeeIndividual) => model.currentStatus !== EmployeeCurrentStatus.Onsite,
            },
            {
              key: 'bankAccounts',
              className: 'tui-form__row block',
              type: 'repeat',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.bankAccountList`,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-3 gap-4',
                fieldGroup: [
                  {
                    key: 'bank',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.bank`,
                      placeholder: `${this.translocoScope.scope}.selectBank`,
                    },
                  },
                  {
                    key: 'bankBranch',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.branch`,
                      placeholder: `${this.translocoScope.scope}.enterBranch`,
                    },
                  },
                  {
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${this.translocoScope.scope}.accountNumber`,
                      placeholder: `${this.translocoScope.scope}.enterAccountNumber`,
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
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'INDIVIDUAL')
    .pipe(tap((data) => (this.model = { ...this.model, ...parseTuiDayFields(data, ['birthDate', 'issueOn']) })));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly addressService: AddressService,
    private readonly officesService: OfficesService
  ) {
    officesService.doLoadOffices();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeIndividual>(parseDateFields(this.form.value, ['birthDate', 'issueOn']))
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
