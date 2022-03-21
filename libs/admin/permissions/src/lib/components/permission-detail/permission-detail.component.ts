import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { of } from 'rxjs';
import { catchError, filter, mapTo, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';

import { Permission, PermissionForm, Policy, PolicyItem, Resource } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-detail',
  templateUrl: './permission-detail.component.html',
  styleUrls: ['./permission-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDetailComponent implements OnInit {
  @Input() hidden!: boolean;
  @Input() servicesForm!: FormGroup;
  @Input() servicesModel!: Partial<Policy>;
  @Input() policyForm!: FormGroup;
  @Input() policyModel!: Partial<Policy>;
  readonly service$ = this.adminPermissions.select('services');
  readonly servicesFields: FormlyFieldConfig[] = [
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
  readonly policyFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      templateOptions: {
        label: 'name',
        required: true,
        translate: true,
        textfieldLabelOutside: true,
        textfieldSize: 'm',
      },
    },
    {
      type: 'text-area',
      key: 'description',
      templateOptions: {
        label: 'description',
        translate: true,
        textfieldLabelOutside: true,
        textfieldSize: 'm',
        expandable: true,
        rows: 15,
      },
    },
  ];
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, searchEnabled: true };
  readonly columns: Columns[] = [
    { key: 'service', title: 'Service' },
    { key: 'detail', title: 'Actions & Resources' },
  ];
  data!: { service: string; permissions: { action: string; resource: string }[] }[];

  constructor(
    private readonly adminPermissions: AdminPermissionsService,
    private readonly promptService: PromptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.policyModel.id && this.updateDataTable();
  }

  updatePolicyItems(): void {
    if (!this.policyModel.policyItems) this.policyModel.policyItems = [];
    (JSON.parse(JSON.stringify(this.servicesModel.policyItems)) as PolicyItem[]).forEach((policyItem) => {
      let result: PolicyItem = this.policyModel.policyItems?.filter(
        (item) => item.service.id === policyItem.service.id
      )[0] as PolicyItem;
      if (!result) {
        result = { service: policyItem.service } as PolicyItem;
        result.permissions = [];
        result.permissionRemoves = [];
        this.policyModel.policyItems?.push(result);
      } else
        result.permissions.forEach((item) => {
          if (
            !JSON.stringify(
              this.servicesModel.policyItems?.filter((item) => item.service.id === result.service.id)
            ).includes((item.resource as Resource).id)
          )
            result.permissionRemoves.push(item);
        });
      policyItem.permissions.forEach((permission) => {
        const action = permission.action;
        if (Array.isArray(permission.resource))
          permission.resource.forEach((resource) => {
            if (result.permissions.findIndex((item) => (item.resource as Resource).id === resource.id) === -1)
              result.permissions.push({ action, resource } as Permission);
          });
      });
    });
  }

  updateDataTable(): void {
    this.data =
      this.servicesModel.policyItems?.map((policy) => {
        const service = policy.service.name;
        const permissions = policy.permissions
          .filter((permission) => (permission.resource as Resource[])?.length)
          .map((permission) => ({
            action: permission.action.name,
            resource: (permission.resource as Resource[]).map((resource) => resource.name).join(', '),
          }));
        return { service, permissions };
      }) || [];
  }

  submitPolicy(): void {
    if (this.policyForm.valid) {
      this.updatePolicyItems();
      this.adminPermissions
        .upsertPermission(this.policyModel)
        .pipe(
          mapTo({ icon: 'success', text: 'Successfully!' } as SweetAlertOptions),
          catchError((error) =>
            of({
              icon: 'error',
              text: error.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((option) => this.promptService.open(option)),
          filter((result) => result.isConfirmed)
        )
        .subscribe(() => this.router.navigateByUrl('admin/permissions'));
    }
  }
}
