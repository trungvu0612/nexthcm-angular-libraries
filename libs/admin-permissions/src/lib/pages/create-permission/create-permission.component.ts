import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiStepState } from '@taiga-ui/kit/enums/step-state';
import { Permission, Service, ServiceInfo } from '../../models/permission';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { validatorText } from '../../utils/validatiors';

@Component({
  selector: 'hcm-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePermissionComponent implements OnInit {
  stepperIndex = 0;
  servicesInfo!: ServiceInfo[];
  passTuiStepState = TuiStepState.Pass;
  normalTuiStepState = TuiStepState.Normal;
  searchControl = new FormControl<string>('');

  servicesForm = new FormGroup<Partial<Permission>>({});
  servicesModel: Partial<Permission> = { services: [{} as Service] };
  servicesFields!: FormlyFieldConfig[];

  permissionForm = new FormGroup<Partial<Permission>>({});
  permissionModel: Partial<Permission> = {};
  permissionFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      templateOptions: {
        label: 'Name',
        textfieldLabelOutside: true,
        textfieldSize: 'm',
      },
      validators: {
        validation: [validatorText(128)],
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
        validation: [validatorText(1000)],
      },
    },
  ];

  constructor(private adminPermissionsService: AdminPermissionsService) {}

  get services(): Service[] {
    return (
      this.servicesModel.services?.filter(
        (item) => item.service?.name.toLowerCase().indexOf(this.searchControl.value.toLowerCase()) > -1
      ) || []
    );
  }

  ngOnInit(): void {
    this.adminPermissionsService.getServicesInfo().subscribe((data) => (this.servicesInfo = data));
    this.servicesFields = [
      {
        type: 'repeat-service',
        key: 'services',
        fieldArray: {
          fieldGroup: [
            {
              type: 'input-service',
              key: 'service',
              templateOptions: {
                options: this.servicesInfo,
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
  }

  nextStep(step: number): void {
    this.stepperIndex += step;
  }
}
