import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Permission, PermissionForm, Policy, Resource } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { validatorTextPermission } from '../../utils/validatiors';

@Component({
  selector: 'hcm-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDetailComponent implements OnInit {
  @Input() hidden!: boolean;
  @Input() servicesForm!: FormGroup<Partial<Policy>>;
  @Input() servicesModel!: Partial<Policy>;
  @Input() policyForm!: FormGroup<Partial<Policy>>;
  @Input() policyModel!: Partial<Policy>;
  service$ = this.adminPermissions.select('services');
  servicesFields: FormlyFieldConfig[] = [
    {
      type: 'repeat-service',
      key: 'policyItems',
      fieldArray: {
        fieldGroup: [
          {
            type: 'input-service',
            key: 'service',
            templateOptions: {
              options: this.service$,
              required: true,
            },
            validation: {
              messages: {
                required: () => this.translocoService.selectTranslate('VALIDATION.required'),
              },
            },
          },
          {
            type: 'input-actions',
            key: 'permissions',
            validators: {
              validation: [
                (c: FormControl) =>
                  c.value?.some((permission: PermissionForm) => permission.resource?.length) ? null : { invalid: true },
              ],
            },
          },
        ],
      },
    },
  ];
  policyFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      templateOptions: {
        label: 'Name',
        required: true,
        textfieldLabelOutside: true,
        textfieldSize: 'm',
      },
      validators: {
        validation: [validatorTextPermission(128)],
      },
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
      },
    },
    {
      type: 'text-area',
      key: 'description',
      templateOptions: {
        label: 'Description',
        textfieldLabelOutside: true,
        textfieldSize: 'm',
        expandable: true,
        rows: 15,
      },
      validators: {
        validation: [validatorTextPermission(1000)],
      },
    },
  ];
  configuration = { ...DefaultConfig, paginationEnabled: false, searchEnabled: true };
  columns: Columns[] = [
    { key: 'service', title: 'Service' },
    { key: 'detail', title: 'Actions & Resources' },
  ];
  data!: { [key: string]: string }[];

  constructor(private adminPermissions: AdminPermissionsService, private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.policyModel.policyId && this.updateDataTable();
  }

  updatePolicyItems(): void {
    const policyItemsOnly: Policy = JSON.parse(JSON.stringify(this.servicesModel));
    policyItemsOnly.policyItems.forEach((policyItem) => {
      const permissions: Permission[] = [];
      policyItem.permissions.forEach((permission) => {
        const action = permission.action;
        if (Array.isArray(permission.resource))
          permission.resource.forEach((resource) => {
            permissions.push({ action, resource } as Permission);
          });
      });
      policyItem.permissions = permissions;
    });
    Object.assign(this.policyModel, policyItemsOnly);
  }

  updateDataTable(): void {
    this.data =
      this.servicesModel.policyItems?.map((policy) => {
        const service = policy.service.name;
        const detail = policy.permissions
          .filter((permission) => permission.resource)
          .map((permission) => {
            return (
              permission.action.name +
              ': ' +
              (permission.resource as Resource[]).map((resource) => resource.name).join(', ')
            );
          })
          .join('\n');
        return { service, detail };
      }) || [];
  }
}
