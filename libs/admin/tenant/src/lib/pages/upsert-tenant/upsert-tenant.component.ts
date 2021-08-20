import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Address, AddressService, ContactDTO, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { iif, of } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  readonly form = new FormGroup({});
  model!: Partial<Tenant>;
  readonly fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex gap-6',
      fieldGroup: [
        {
          key: 'tenantName',
          type: 'input',
          className: 'flex-1',
          templateOptions: {
            required: true,
            translate: true,
            label: 'companyName',
            placeholder: 'enterCompanyName',
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'user.username',
          type: 'input',
          templateOptions: {
            readonly: true,
            translate: true,
            label: 'username',
            textfieldLabelOutside: true,
          },
          hideExpression: '!model.id',
          expressionProperties: { className: (model) => (model.id ? 'flex-1' : 'hidden') },
        },
      ],
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
      fieldGroupClassName: 'grid grid-cols-2 gap-x-6 gap-y-4',
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
          key: 'tax',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'taxCode',
            placeholder: 'enterTaxCode',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
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
          key: 'contacts.phone',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'phone',
            placeholder: 'enterPhoneNumber',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
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
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  const countryControl = this.form.get('addresses.countryId');
                  if (field?.templateOptions && countryControl)
                    field.templateOptions.options = countryControl.valueChanges.pipe(
                      tap(() => field.formControl?.setValue(null)),
                      switchMap((countryId) => (countryId ? this.addressService.getPlaces(countryId) : of([]))),
                      startWith([])
                    );
                },
              },
            },
          ],
        },
        {
          key: 'contacts.email',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'email',
            placeholder: 'enterEmail',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.email()] },
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-4',
          fieldGroup: [
            {
              key: 'addresses.districtId',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'district',
                placeholder: 'chooseDistrict',
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  const cityControl = this.form.get('addresses.cityId');
                  if (field?.templateOptions && cityControl)
                    field.templateOptions.options = cityControl.valueChanges.pipe(
                      tap(() => field.formControl?.setValue(null)),
                      switchMap((cityId) => (cityId ? this.addressService.getPlaces(cityId) : of([]))),
                      startWith([])
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
    this.adminTenantService.getTenant(),
    of({} as Tenant)
  ).pipe(
    tap((tenant) => {
      if (tenant.addresses) tenant.addresses = (tenant.addresses as Address[])[0];
      if (tenant.contacts) tenant.contacts = (tenant.contacts as ContactDTO[])[0];
      this.model = tenant;
    })
  );

  constructor(
    private adminTenantService: AdminTenantService,
    private addressService: AddressService,
    private uploadFileService: UploadFileService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService
  ) {}

  submitTenant() {
    if (this.form.valid) {
      const formModel = { ...this.model };
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
