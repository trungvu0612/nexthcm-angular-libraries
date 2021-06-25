import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { map, startWith, tap } from 'rxjs/operators';
import { DomainTenantData } from '../../models/tenant';

@Component({
  selector: 'hcm-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrls: ['./upsert-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTenantComponent implements OnInit {
  // init domain data table
  data: Partial<DomainTenantData>[] = [
    {
      id: '123131',
      logo: '',
      title: 'Banvien',
      status: 'Hoạt động',
    },
    {
      id: '123131',
      logo: '',
      title: 'Banvien',
      status: 'Hoạt động',
    },
  ];
  columns = ['id', 'logo', 'title', 'status', 'action'];
  // init domain data table

  activeItemIndex = 0;
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'company',
      type: 'input',
      templateOptions: {
        label: 'Company:',
        required: true,
        size: 's',
      },
    },
    {
      className: 'col-span-full attachFile',
      key: 'attachFile',
      type: 'upload-file',
      templateOptions: {
        label: 'Image:',
        textfieldSize: 's',
      },
    },
    {
      key: 'address',
      type: 'input',
      templateOptions: {
        label: 'Address:',
        required: true,
        size: 's',
      },
    },
    {
      key: 'companyTax',
      type: 'input',
      templateOptions: {
        label: 'Company Tax:',
        required: true,
        size: 's',
      },
    },
    {
      key: 'website',
      type: 'input',
      templateOptions: {
        label: 'Website:',
        required: true,
        size: 's',
      },
    },

    {
      key: 'country',
      type: 'select',
      templateOptions: {
        label: 'Country',
        options: [{ id: '1', name: 'Viet Nam' }],
        valueProp: 'id',
        labelProp: 'name',
      },
    },
    {
      key: 'city',
      type: 'select',
      templateOptions: {
        label: 'City',
        options: [],
        valueProp: 'id',
        labelProp: 'name',
      },
      hooks: {
        onInit: (field) => {
          const cities = [
            { id: '1', name: 'TP. Hồ Chí Minh', countryId: '1' },
            { id: '2', name: 'TP. Hà Nội', countryId: '1' },
          ];
          const countryControl = this.form.get('country');
          field!.templateOptions!.options = countryControl?.valueChanges.pipe(
            startWith(countryControl.value),
            map((countryId) => cities.filter((city) => city.countryId === countryId)),
            tap(() => field!.formControl!.setValue(null))
          );
        },
      },
    },
    {
      key: 'province',
      type: 'select',
      templateOptions: {
        label: 'Province',
        options: [],
        valueProp: 'id',
        labelProp: 'name',
      },
      hooks: {
        onInit: (field) => {
          const provinces = [
            { id: '1', name: 'Quận 1', cityId: '1' },
            { id: '2', name: 'Quận 2', cityId: '1' },
            { id: '3', name: 'Quận Hoàng Mai', cityId: '2' },
            { id: '4', name: 'Quận Ba Đình', cityId: '2' },
          ];
          const cityControl = this.form.get('city');
          field!.templateOptions!.options = cityControl?.valueChanges.pipe(
            startWith(cityControl.value),
            map((cityId) => provinces.filter((province) => province.cityId === cityId)),
            tap(() => field!.formControl!.setValue(null))
          );
        },
      },
    },
    {
      key: 'zipcode',
      type: 'input',
      templateOptions: {
        label: 'Zip code:',
        required: true,
        size: 's',
      },
    },
    {
      key: 'phone',
      type: 'input',
      templateOptions: {
        label: 'Phone:',
        required: true,
        size: 's',
      },
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email:',
        required: true,
        size: 's',
      },
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  saveTenant() {}
}
