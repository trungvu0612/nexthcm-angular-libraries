import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, startWith, tap } from 'rxjs/operators';
import { UploadFileService, ValidationService } from '@nexthcm/ui';
import { Tenant } from '../../models/tenant';
import { FormGroup } from '@ngneat/reactive-forms';
import { Router } from '@angular/router';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantComponent implements OnInit {
  isAdd!: boolean;
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
        textfieldLabelOutside: true,
      },
      ...this.validationService.getValidation(['required']),
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
            labelParams: { value: 1 },
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required']),
        },
        {
          key: 'addresses.address2',
          type: 'input',
          templateOptions: {
            translate: true,
            label: 'addresses',
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
                options: [{ id: '1', name: 'Viet Nam' }],
                valueProp: 'id',
                labelProp: 'name',
              },
              ...this.validationService.getValidation(['required']),
            },
            {
              key: 'addresses.state',
              type: 'select',
              templateOptions: {
                required: true,
                translate: true,
                label: 'province',
                valueProp: 'id',
                labelProp: 'name',
              },
              ...this.validationService.getValidation(['required']),
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
                valueProp: 'id',
                labelProp: 'name',
              },
              ...this.validationService.getValidation(['required']),
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
                textfieldLabelOutside: true,
              },
              ...this.validationService.getValidation(['required']),
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
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required']),
        },
        {
          key: 'tax',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'taxCode',
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required']),
        },
        {
          key: 'contacts.phone',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'phone',
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required']),
        },
        {
          key: 'contacts.email',
          type: 'input',
          templateOptions: {
            required: true,
            label: 'Email',
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required', 'email'], ['email']),
        },
        {
          key: 'contacts.website',
          type: 'input',
          templateOptions: {
            required: true,
            label: 'Website',
            textfieldLabelOutside: true,
          },
          ...this.validationService.getValidation(['required']),
        },
      ],
    },
  ];

  constructor(
    private adminTenantService: AdminTenantService,
    private uploadFileService: UploadFileService,
    private validationService: ValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdd = this.router.url.includes('/add');
    if (!this.isAdd) this.model = this.adminTenantService.get();
  }
}
