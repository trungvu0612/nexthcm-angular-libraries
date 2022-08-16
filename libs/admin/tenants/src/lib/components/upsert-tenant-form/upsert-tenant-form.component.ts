import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { AddressService, CommonStatus, FilesService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';
import { debounceTime, startWith, switchMap, take, tap } from 'rxjs/operators';

import { Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-upsert-tenant-form',
  templateUrl: './upsert-tenant-form.component.html',
  styleUrls: ['./upsert-tenant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantFormComponent {
  @Input() submitLoading = false;
  @Output() submitted = new EventEmitter<Tenant>();
  @Output() cancel = new EventEmitter();

  form = this.fb.group({} as Tenant);
  model = {} as Tenant;
  fields: FormlyFieldConfig[] = [
    {
      key: 'tenantName',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        required: true,
        translate: true,
        label: `${this.translocoScope.scope}.tenantName`,
        labelClassName: 'font-semibold',
        placeholder: `${this.translocoScope.scope}.enterTenantName`,
        textfieldLabelOutside: true,
      },
      expressionProperties: { 'templateOptions.readonly': 'model.hasLDAPUser' },
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-x-6',
      fieldGroup: [
        {
          key: 'shortname',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: `${this.translocoScope.scope}.shortname`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterShortname`,
            textfieldLabelOutside: true,
          },
          asyncValidators: {
            shortname: {
              expression: (control: AbstractControl) =>
                !control.valueChanges || control.pristine
                  ? of(true)
                  : control.valueChanges.pipe(
                      debounceTime(1000),
                      take(1),
                      switchMap((shortname: string) =>
                        this.data.shortname === shortname
                          ? of(true)
                          : this.adminTenantsService.checkTenantShortname({ shortname })
                      ),
                      tap(() => control.markAsTouched())
                    ),
              message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
            },
          },
        },
        {
          key: 'username',
          type: 'input',
          templateOptions: {
            readonly: true,
            translate: true,
            label: 'username',
            labelClassName: 'font-semibold',
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
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        label: `${this.translocoScope.scope}.tenantLogo`,
        labelClassName: 'font-semibold',
        accept: 'image/*',
        required: true,
        previewImage: true,
        serverRequest: (file: File) => this.filesService.uploadFile('admin-tenant', file),
      },
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-x-6 gap-y-5',
      fieldGroup: [
        {
          key: 'addresses.address1',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'addresses',
            labelClassName: 'font-semibold',
            placeholder: 'enterAddress',
            labelParams: { value: 1 },
            textfieldLabelOutside: true,
            required: true,
          },
        },
        {
          key: 'tax',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: this.translocoScope.scope + '.taxCode',
            labelClassName: 'font-semibold',
            placeholder: this.translocoScope.scope + '.enterTaxCode',
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
            labelClassName: 'font-semibold',
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
            labelClassName: 'font-semibold',
            placeholder: 'enterPhoneNumber',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
          fieldGroup: [
            {
              key: 'addresses.countryId',
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
              key: 'addresses.cityId',
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
                  const countryControl = this.form.get('addresses.countryId') as FormControl;
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
          key: 'email',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'email',
            labelClassName: 'font-semibold',
            placeholder: 'enterEmail',
            textfieldLabelOutside: true,
          },
          validators: { validation: [RxwebValidators.email()] },
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-x-4 gap-y-5',
          fieldGroup: [
            {
              key: 'addresses.districtId',
              type: 'select',
              className: 'tui-form__row block',
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
                  const cityControl = this.form.get('addresses.cityId') as FormControl;
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
              key: 'addresses.wardId',
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
                  const districtCtrl = this.form.get('addresses.districtId') as FormControl;
                  if (field?.templateOptions && districtCtrl)
                    field.templateOptions.options = districtCtrl.valueChanges.pipe(
                      tap(() => field.formControl?.setValue(null)),
                      startWith(districtCtrl.value),
                      switchMap((districtId) => (districtId ? this.addressService.getPlaces(districtId) : of([]))),
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
                labelClassName: 'font-semibold',
                placeholder: 'enterPostalCode',
                textfieldLabelOutside: true,
              },
              validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'website',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.website`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterWebsite`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'statusBoolean',
              className: 'tui-form__row block',
              type: 'status-toggle',
              defaultValue: true,
              templateOptions: {
                translate: true,
                label: 'status',
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
              },
            },
          ],
        },
      ],
    },
    { key: 'id' },
    { key: 'addressId' },
    { key: 'hasLDAPUser' },
  ];

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly addressService: AddressService,
    private readonly filesService: FilesService,
    private readonly translocoService: TranslocoService
  ) {}

  private _data = {} as Tenant;

  get data(): Tenant {
    return this._data;
  }

  @Input()
  set data(value: Tenant) {
    this._data = value;
    this._data.statusBoolean = this.data.state !== CommonStatus.inactive;
    if (value) {
      this.model = { ...this.model, ...this._data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.state = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.submitted.emit(formModel);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
