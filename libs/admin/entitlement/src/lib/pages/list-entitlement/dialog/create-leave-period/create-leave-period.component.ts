import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'hcm-create-leave-period',
  templateUrl: './create-leave-period.component.html',
  styleUrls: ['./create-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeavePeriodComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'name',
          type: 'input-date',
          templateOptions: {
            label: 'officeName',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'name1',
          type: 'input-date',
          templateOptions: {
            label: 'officeName',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
  ];

  submit() {}

  cancel() {}
}
