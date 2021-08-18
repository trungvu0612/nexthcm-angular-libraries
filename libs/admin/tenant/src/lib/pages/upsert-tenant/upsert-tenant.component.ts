import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Address, AddressService, ContactDTO, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { iif, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { Tenant } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantComponent {
  readonly form = this.formBuilder.group<Tenant>({} as Tenant);
  model: Partial<Tenant> = {};
  readonly country$ = this.addressService.getPlaces();
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
                options: this.country$,
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
                    switchMap((countryId) => (countryId ? this.addressService.getPlaces(countryId) : of([])))
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
                    switchMap((cityId) => (cityId ? this.addressService.getPlaces(cityId) : of([])))
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
    this.adminTenantService.getTenant().pipe(tap((tenant) => (this.model = tenant))),
    of(true)
  );

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly addressService: AddressService,
    private readonly promptService: PromptService,
    private readonly uploadFileService: UploadFileService,
    private readonly router: Router,
    private formBuilder: FormBuilder
  ) {}

  submitTenant() {
    if (this.form.valid) {
      this.model.addresses = [this.model.addresses as Address];
      this.model.contacts = [this.model.contacts as ContactDTO];
      this.adminTenantService[this.model.id ? 'editTenant' : 'createTenant'](this.model)
        .pipe(
          mapTo({ icon: 'success', text: 'Successfully!' } as SweetAlertOptions),
          catchError((error) => {
            this.model.addresses = (this.model.addresses as Address[])[0];
            this.model.contacts = (this.model.contacts as ContactDTO[])[0];
            return of({
              icon: 'error',
              text: error.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions);
          }),
          switchMap((option) => this.promptService.open(option)),
          filter((result) => result.isConfirmed)
        )
        .subscribe(() => this.router.navigateByUrl('/admin/tenant'));
    }
  }
}
