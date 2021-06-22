import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';
import { Policy } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { validatorTextPermission } from '../../utils/validatiors';

@Component({
  selector: 'hcm-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePermissionComponent {
  stepperIndex = 0;
  servicesLength$ = this.adminPermissions.getServices().pipe(map((items) => items.length));

  servicesForm = new FormGroup<Partial<Policy>>({});
  servicesModel: Partial<Policy> = {};
  servicesFields: FormlyFieldConfig[] = [
    {
      type: 'repeat-service',
      key: 'policyItems',
      defaultValue: [{}],
      fieldArray: {
        fieldGroup: [
          {
            type: 'input-service',
            key: 'service',
            templateOptions: {
              options: [],
              required: true,
            },
          },
          {
            type: 'input-actions',
            key: 'actions',
          },
        ],
      },
    },
  ];

  policyForm = new FormGroup<Partial<Policy>>({});
  policyModel!: Partial<Policy>;
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

  constructor(private adminPermissions: AdminPermissionsService) {}

  nextStep(step: number): void {
    this.stepperIndex += step;
  }
}
