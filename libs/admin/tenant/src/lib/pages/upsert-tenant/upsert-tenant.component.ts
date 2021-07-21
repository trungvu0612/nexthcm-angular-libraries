import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, UploadFileService } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { Tenant } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantComponent implements OnInit {
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
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
    {
      key: 'image',
      type: 'upload-file',
      templateOptions: {
        required: true,
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
          validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
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
                required: true,
                translate: true,
                label: 'country',
                placeholder: 'chooseCountry',
                options: [{ id: '1', name: 'Viet Nam' }],
                valueProp: 'id',
                labelProp: 'name',
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
              },
            },
            {
              key: 'addresses.state',
              type: 'select',
              templateOptions: {
                required: true,
                translate: true,
                label: 'province',
                placeholder: 'chooseProvince',
                valueProp: 'id',
                labelProp: 'name',
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                required: true,
                translate: true,
                label: 'city',
                placeholder: 'chooseCity',
                valueProp: 'id',
                labelProp: 'name',
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                required: true,
                translate: true,
                label: 'postalCode',
                placeholder: 'enterPostalCode',
                textfieldLabelOutside: true,
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
              },
            },
          ],
        },
        {
          key: 'user.username',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'username',
            placeholder: 'enterUsername',
            textfieldLabelOutside: true,
          },
          validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
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
          validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
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
          validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
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
          validation: {
            messages: {
              required: () => this.translocoService.selectTranslate('VALIDATION.required'),
              email: () => this.translocoService.selectTranslate('VALIDATION.invalidEmail'),
            },
          },
        },
        {
          key: 'contacts.website',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'website',
            placeholder: 'enterWebsite',
            textfieldLabelOutside: true,
          },
          validation: {
            messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
          },
        },
      ],
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.url[0].path === 'information') this.model = this.adminTenantService.get('tenant');
  }

  submitTenant() {
    if (this.form.valid) {
      this.adminTenantService[this.model.id ? 'editTenant' : 'createTenant'](this.model)
        .pipe(switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => this.router.navigateByUrl('/admin/tenant'));
    }
  }
}
