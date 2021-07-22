import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, UploadFileService } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { catchError, filter, map, mapTo, startWith, switchMap, tap } from 'rxjs/operators';
import { Tenant } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { iif, of } from 'rxjs';
import { Address, ContactDTO } from '@nexthcm/core';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantComponent {
  readonly form = new FormGroup<Partial<Tenant>>({});
  model: Partial<Tenant> = {};
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
        // required: true,
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
      fieldGroupClassName: 'grid grid-flow-col grid-rows-5 grid-cols-2 gap-x-6',
      fieldGroup: [
        {
          key: 'addresses.address1',
          type: 'input',
          templateOptions: {
            required: true,
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
          key: 'addresses.address3',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'addresses',
            placeholder: 'enterAddress',
            labelParams: { value: 3 },
            textfieldLabelOutside: true,
          },
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
          fieldGroup: [
            {
              key: 'addresses.countryId',
              type: 'select',
              templateOptions: {
                // required: true,
                translate: true,
                label: 'country',
                placeholder: 'chooseCountry',
                options: [{ id: '1', name: 'Viet Nam' }],
                valueProp: 'id',
                labelProp: 'name',
              },
            },
            {
              key: 'addresses.state',
              type: 'select',
              templateOptions: {
                // required: true,
                translate: true,
                label: 'province',
                placeholder: 'chooseProvince',
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  if (field) {
                    const cities = [
                      { id: '1', name: 'TP. Hồ Chí Minh', countryId: '1' },
                      { id: '2', name: 'TP. Hà Nội', countryId: '1' },
                    ];
                    const countryControl = this.form.get('addresses.countryId');
                    if (field.templateOptions) {
                      field.templateOptions.options = countryControl?.valueChanges.pipe(
                        startWith(countryControl.value as string),
                        map((countryId) => cities.filter((city) => city.countryId === countryId)),
                        tap(() => field.formControl?.setValue(null))
                      );
                    }
                  }
                },
              },
            },
          ],
        },
        {
          fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
          fieldGroup: [
            {
              key: 'addresses.city',
              type: 'select',
              templateOptions: {
                // required: true,
                translate: true,
                label: 'city',
                placeholder: 'chooseCity',
                valueProp: 'id',
                labelProp: 'name',
              },
              hooks: {
                onInit: (field) => {
                  if (field) {
                    const districts = [
                      { id: '1', name: 'Quận 1', cityId: '1' },
                      { id: '2', name: 'Quận 2', cityId: '1' },
                      { id: '3', name: 'Quận Hoàng Mai', cityId: '2' },
                      { id: '4', name: 'Quận Ba Đình', cityId: '2' },
                    ];
                    const provinceControl = this.form.get('addresses.state');
                    if (field.templateOptions)
                      field.templateOptions.options = provinceControl?.valueChanges.pipe(
                        startWith(provinceControl.value as string),
                        map((cityId) => districts.filter((province) => province.cityId === cityId)),
                        tap(() => field.formControl?.setValue(null))
                      );
                  }
                },
              },
            },
            {
              key: 'addresses.postalCode',
              type: 'input',
              templateOptions: {
                // required: true,
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
          key: 'user.username',
          type: 'input',
          templateOptions: {
            // required: true,
            translate: true,
            label: 'username',
            placeholder: 'enterUsername',
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'tax',
          type: 'input',
          templateOptions: {
            // required: true,
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
            // required: true,
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
            // required: true,
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
            // required: true,
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
    () => !!this.route.snapshot.queryParams.id,
    this.adminTenantService.getTenant(this.route.snapshot.queryParams.id).pipe(tap((tenant) => (this.model = tenant))),
    of(true)
  );

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly promptService: PromptService,
    private readonly uploadFileService: UploadFileService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
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
    } else this.promptService.open({ icon: 'error', text: this.form.status } as SweetAlertOptions);
  }
}
