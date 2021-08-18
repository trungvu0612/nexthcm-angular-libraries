import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Address, AddressService, ContactDTO, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { iif, of } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Tenant } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertTenantComponent {
  readonly form = this.formBuilder.group<Tenant>({} as Tenant);
  model = {} as Tenant;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'tenantName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'companyName',
        placeholder: 'enterCompanyName',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'image',
      type: 'upload-file',
      templateOptions: {
        translate: true,
        label: 'companyLogo',
        linkText: 'chooseAnImage',
        labelText: 'orDropItHere',
        accept: 'image/*',
        previewImage: true,
        serverRequest: (file: File) => this.uploadFileService.uploadFile('admin-tenant', file),
      },
    },
    {
      fieldGroupClassName: 'grid grid-flow-col grid-rows-5 grid-cols-2 gap-x-6 gap-y-4',
      fieldGroup: [
        {
          key: 'addresses.address1',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'addresses',
            placeholder: 'enterAddress',
            labelParams: { value: 1 },
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'addresses.address2',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'addresses',
            placeholder: 'enterAddress',
            labelParams: { value: 2 },
            textfieldLabelOutside: true,
          },
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-4',
          fieldGroup: [
            {
              key: 'addresses.countryId',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'country',
                placeholder: 'chooseCountry',
                options: this.addressService.select('countries'),
                valueProp: 'id',
                labelProp: 'name',
              },
            },
            {
              key: 'addresses.cityId',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'province',
                placeholder: 'chooseProvince',
                options: [],
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  const countryControl = this.form.get('addresses.countryId');
                  field!.templateOptions!.options = countryControl?.valueChanges.pipe(
                    tap(() => field?.formControl?.setValue(null)),
                    startWith(countryControl.value as string),
                    distinctUntilChanged(),
                    switchMap((countryId) => (countryId ? this.addressService.getPlaces(countryId) : of([]))),
                    takeUntil(this.destroy$)
                  );
                },
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-4',
          fieldGroup: [
            {
              key: 'addresses.districtId',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'ward',
                placeholder: 'chooseWard',
                options: [],
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  const cityControl = this.form.get('addresses.cityId');
                  field!.templateOptions!.options = cityControl?.valueChanges.pipe(
                    tap(() => field?.formControl?.setValue(null)),
                    startWith(cityControl.value as string),
                    distinctUntilChanged(),
                    switchMap((cityId) => (cityId ? this.addressService.getPlaces(cityId) : of([]))),
                    takeUntil(this.destroy$)
                  );
                },
              },
            },
            {
              key: 'addresses.postalCode',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'postalCode',
                placeholder: 'enterPostalCode',
                textfieldLabelOutside: true,
              },
              validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
            },
          ],
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-4',
          fieldGroup: [
            {
              key: 'user.profile.firstName',
              type: 'input',
              templateOptions: {
                required: true,
                translate: true,
                label: 'firstName',
                placeholder: 'enterFirstName',
                textfieldLabelOutside: true,
              },
              expressionProperties: { 'templateOptions.disabled': 'model.id' },
            },
            {
              key: 'user.profile.lastName',
              type: 'input',
              templateOptions: {
                required: true,
                translate: true,
                label: 'lastName',
                placeholder: 'enterLastName',
                textfieldLabelOutside: true,
              },
              expressionProperties: { 'templateOptions.disabled': 'model.id' },
            },
          ],
        },

        {
          key: 'tax',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'taxCode',
            placeholder: 'enterTaxCode',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
        },
        {
          key: 'contacts.phone',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'phone',
            placeholder: 'enterPhoneNumber',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
        },
        {
          key: 'contacts.email',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'email',
            placeholder: 'enterEmail',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.email()] },
        },
        {
          key: 'contacts.website',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'website',
            placeholder: 'enterWebsite',
            textfieldLabelOutside: true,
          },
        },
      ],
    },
  ];
  readonly sign$ = iif(
    () => !!this.adminTenantService.get('id'),
    this.adminTenantService.getTenant().pipe(
      tap((tenant) => {
        if (tenant.addresses) {
          tenant.addresses = (tenant.addresses as Address[])[0];
        }
        this.model = { ...this.model, ...tenant };
      })
    ),
    of(true)
  );

  constructor(
    private adminTenantService: AdminTenantService,
    private addressService: AddressService,
    private promptService: PromptService,
    private uploadFileService: UploadFileService,
    private destroy$: TuiDestroyService,
    private formBuilder: FormBuilder
  ) {}

  submitTenant() {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      formModel.addresses = [formModel.addresses as Address];
      formModel.contacts = [formModel.contacts as ContactDTO];
      this.adminTenantService[formModel.id ? 'editTenant' : 'createTenant'](formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(formModel.id ? 'updateTenantSuccessfully' : 'createTenantSuccessfully')
        );
    }
  }
}
