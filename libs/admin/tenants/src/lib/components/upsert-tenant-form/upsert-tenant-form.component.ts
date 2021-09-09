import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressService, UploadFileService } from '@nexthcm/cdk';
import { AbstractControl, FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';
import { delay, filter, startWith, switchMap, tap } from 'rxjs/operators';
import { Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-upsert-tenant-form',
  templateUrl: './upsert-tenant-form.component.html',
  styleUrls: ['./upsert-tenant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantFormComponent {
  @Output() submitted = new EventEmitter<Tenant>();
  @Output() cancel = new EventEmitter();

  form = this.fb.group<Tenant>({} as Tenant);
  model = {} as Tenant;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'hasLDAPUser' },
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
      expressionProperties: { 'templateOptions.readonly': 'model.hasLDAPUser' },
    },
    {
      fieldGroupClassName: 'flex gap-6',
      fieldGroup: [
        {
          key: 'shortname',
          type: 'input',
          className: 'flex-1',
          templateOptions: {
            required: true,
            translate: true,
            label: 'shortname',
            placeholder: 'enterShortname',
            textfieldLabelOutside: true,
          },
          asyncValidators: {
            shortname: {
              expression: (control: AbstractControl<string>) =>
                of(control.value).pipe(
                  delay(500),
                  filter((shortname) => this.data.shortname !== shortname),
                  switchMap((shortname: string) => this.adminTenantsService.checkTenantShortname({ shortname }))
                ),
              message: () => this.translocoService.selectTranslate('VALIDATION.shortnameExists'),
            },
          },
          expressionProperties: { 'templateOptions.readonly': 'model.id' },
        },
        {
          key: 'username',
          type: 'input',
          templateOptions: {
            readonly: true,
            translate: true,
            label: 'username',
            textfieldLabelOutside: true,
          },
          hideExpression: '!model.id',
          expressionProperties: {
            className: (model) => (model.id ? 'flex-1' : 'hidden'),
            'templateOptions.readonly': '(model.hasLDAPUser)',
          },
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
          key: 'phone',
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
                  const countryControl = this.form.get('addresses.countryId') as FormControl<string>;
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
          key: 'email',
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
                  const cityControl = this.form.get('addresses.cityId') as FormControl<string>;
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
          key: 'website',
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly addressService: AddressService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService
  ) {}

  private _data = {} as Tenant;

  get data(): Tenant {
    return this._data;
  }

  @Input()
  set data(value: Tenant) {
    this._data = value;
    if (value) {
      this.model = { ...this.model, ...value };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
