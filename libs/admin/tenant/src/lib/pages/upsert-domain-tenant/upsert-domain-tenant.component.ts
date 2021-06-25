import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'hcm-upsert-domain-tenant',
  templateUrl: './upsert-domain-tenant.component.html',
  styleUrls: ['./upsert-domain-tenant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDomainTenantComponent implements OnInit {
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'company',
      type: 'input',
      templateOptions: {
        label: 'Tên công ty:',
        required: true,
        size: 's',
      },
    },
    {
      className: 'attachFile',
      key: 'image',
      type: 'upload-file',
      templateOptions: {
        label: 'Logo công ty:',
        textfieldSize: 's',
      },
    },
    {
      key: 'domain',
      type: 'input',
      templateOptions: {
        label: 'Domain:',
        required: true,
        size: 's',
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  saveDomain() {}

  cancel() {
    this.router.navigateByUrl('/admin/tenant/add');
  }
}
