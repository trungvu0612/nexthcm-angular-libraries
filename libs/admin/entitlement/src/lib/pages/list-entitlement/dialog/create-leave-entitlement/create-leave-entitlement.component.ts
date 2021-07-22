import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { of } from 'rxjs';

@Component({
  selector: 'hcm-create-leave-entitlement',
  templateUrl: './create-leave-entitlement.component.html',
  styleUrls: ['./create-leave-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeaveEntitlementComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      /*Add to multiple employees*/ fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Add to multiple employees</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'state',
          type: 'toggle',
          templateOptions: { textfieldLabelOutside: true },
          expressionProperties: {
            // 'templateOptions.label': of('Status:'),
            'templateOptions.description': of('Active'),
          },
        },
      ],
    },

    {
      /*Employee*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <div class="flex flex-row">
          <div class="font-bold">Employee</div>
          <div class="font-bold text-red-500">*</div>
        </div>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Branch*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Branch</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Branch*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Sub Unit</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Branch*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Job title</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Branch*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Leave type</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Leave period **/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Leave period</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to',
          },
        },
      ],
    },

    {
      /*Leave period **/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Entitlement</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'name',
          type: 'input',
          templateOptions: {
            translate: true,
            required: true,
          },
        },
      ],
    },
  ];

  submit() {}

  cancel() {}
}
