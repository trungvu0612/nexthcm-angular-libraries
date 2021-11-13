import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { cacheable } from '@datorama/akita';
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
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeIndividualQuery, EmployeeIndividualStore, EmployeeQuery } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

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
              key: 'permanentAddress',
              className: 'tui-form__row block',
              fieldGroup: [
                {
                  key: 'address1',
                  className: 'tui-form__row block',
                  type: 'input',
                  templateOptions: {
                    translate: true,
                    label: `${TRANSLATION_SCOPE}.permanentAddress`,
                    labelClassName: 'font-semibold',
                    placeholder: `${TRANSLATION_SCOPE}.enterPermanentAddress`,
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
                          const countryControl = this.form.get('permanentAddress.countryId') as FormControl<string>;
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
                          const cityControl = this.form.get('permanentAddress.cityId') as FormControl<string>;
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
                          const districtCtrl = this.form.get('permanentAddress.districtId') as FormControl<string>;
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
                    label: `${TRANSLATION_SCOPE}.temporaryAddress`,
                    labelClassName: 'font-semibold',
                    placeholder: `${TRANSLATION_SCOPE}.enterTemporaryAddress`,
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
                          const countryControl = this.form.get('temporaryAddress.countryId') as FormControl<string>;
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
                          const cityControl = this.form.get('temporaryAddress.cityId') as FormControl<string>;
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
                          const districtCtrl = this.form.get('temporaryAddress.districtId') as FormControl<string>;
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
                label: `${TRANSLATION_SCOPE}.DOB`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterDOB`,
              },
            },
            {
              key: 'idNumber',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.idNumber`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterIDNumber`,
              },
            },
            {
              key: 'issueOn',
              className: 'tui-form__row block',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.issueOn`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterIssueOn`,
              },
            },
            {
              key: 'issueAt',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.issueAt`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterIssueAt`,
              },
            },
            {
              key: 'nationality',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.nationality`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterNationality`,
              },
            },
            {
              key: 'section',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.section`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterSection`,
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
                label: `${TRANSLATION_SCOPE}.companyEmail`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterCompanyEmail`,
              },
              validators: { validation: [RxwebValidators.email()] },
            },
            {
              key: 'personalEmail',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.personalEmail`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterPersonalEmail`,
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
                options: this.officesQuery.selectAll(),
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
                label: `${TRANSLATION_SCOPE}.gender`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.chooseGender`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>('GENDER_OPTIONS', {}, TRANSLATION_SCOPE)
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
                label: `${TRANSLATION_SCOPE}.maritalStatus`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.chooseMaritalStatus`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>('MARITAL_STATUS_OPTIONS', {}, TRANSLATION_SCOPE)
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
                label: `${TRANSLATION_SCOPE}.religion`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${TRANSLATION_SCOPE}.enterReligion`,
              },
            },
            {
              key: 'currentStatus',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.currentStatus`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.chooseCurrentStatus`,
                valueProp: 'value',
                options: this.translocoService
                  .selectTranslateObject<HashMap<string>>('INDIVIDUAL_STATUS', {}, TRANSLATION_SCOPE)
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
                label: `${TRANSLATION_SCOPE}.officeOnsite`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.chooseOfficeOnsite`,
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
                label: `${TRANSLATION_SCOPE}.bankAccountList`,
              },
              fieldArray: {
                fieldGroupClassName: 'grid grid-cols-3 gap-4',
                fieldGroup: [
                  {
                    key: 'bank',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${TRANSLATION_SCOPE}.bank`,
                      placeholder: `${TRANSLATION_SCOPE}.selectBank`,
                    },
                  },
                  {
                    key: 'bankBranch',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${TRANSLATION_SCOPE}.branch`,
                      placeholder: `${TRANSLATION_SCOPE}.enterBranch`,
                    },
                  },
                  {
                    key: 'number',
                    type: 'input',
                    templateOptions: {
                      translate: true,
                      label: `${TRANSLATION_SCOPE}.accountNumber`,
                      placeholder: `${TRANSLATION_SCOPE}.enterAccountNumber`,
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
  private readonly request$ = this.employeeIndividualQuery
    .select()
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly addressService: AddressService,
    private readonly officesQuery: OfficesQuery,
    private readonly employeeIndividualQuery: EmployeeIndividualQuery,
    private readonly employeeIndividualStore: EmployeeIndividualStore,
    employeeQuery: EmployeeQuery,
    actions: Actions
  ) {
    actions.dispatch(loadOffices());
    cacheable(
      this.employeeIndividualStore,
      this.employeesService.getEmployeeInformation(employeeQuery.getValue().id, 'INDIVIDUAL').pipe(
        tap((res) => {
          this.employeeIndividualStore.update(parseTuiDayFields(res, ['birthDate', 'issueOn']));
          this.employeeIndividualStore.setHasCache(true);
        })
      )
    ).subscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeIndividual>(parseDateFields(this.form.value, ['birthDate', 'issueOn']))
        .pipe(
          tap(() => this.employeeIndividualStore.update(this.form.value)),
          takeUntil(this.destroy$)
        )
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
