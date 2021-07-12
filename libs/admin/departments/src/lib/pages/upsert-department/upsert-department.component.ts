import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { BranchesService } from '../../../../../branches/src/lib/services/branches.service';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-upsert-department',
  templateUrl: './upsert-department.component.html',
  styleUrls: ['./upsert-department.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertDepartmentComponent  {

  readonly branchForm = new FormGroup({});
  model: Partial<any> =  {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    { /*Ten chi nhánh*/
      fieldGroupClassName: 'mt-4 grid grid-cols-4 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Tên chi nhánh</p>
        `
        },
        {
          className: 'col-span-2',
          key: 'name',
          type: 'input',
          templateOptions: {
            required: true
          },
        }
      ]
    },

    { /*Mô tả*/
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Mô tả</p>
        `
        },
        {
          className: 'col-span-2',
          key: 'name2',
          type: 'text-area',
          templateOptions: {
            required: true
          },
        }
      ]
    },

    { /*Địa chỉ*/
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Địa chỉ</p>
        `
        },
        {
          className: 'col-span-2',
          key: 'name3',
          type: 'text-area',
          templateOptions: {
            required: true
          },
        }
      ]
    },

    { /*Branch*/
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Admin</p>
        `
        },
        {
          className: 'col-span-2',
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            options: [],
            labelProp: 'username',
            valueProp: 'id',
            placeholder: 'Send to'
          }
        }
      ]
    },

    { /*Branch*/
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Văn Phòng</p>
        `
        },
        {
          key: 'office',
          type: 'select',
          templateOptions: {
            placeholder: 'Office Name',
          },
        },
      ]
    },


    {
      className: 'flex',
      key: 'officeArray',
      type: 'repeat1',
      templateOptions: {
        addText: 'Add Offices',
      },
      fieldArray: {
        fieldGroup: [
          {
            className: '',
            template: `
                      <p class='font-bold'>Văn Phòng</p>
                        `
          },
          {
            className: '',
            key: 'officeArr',
            type: 'select',
            templateOptions: {
              placeholder: 'Office Name',
            },
          },
        ],
      },
    },






    // {
    //   key: 'officeArray',
    //   type: 'repeat',
    //   templateOptions: {
    //     addText: 'Add Offices',
    //   },
    //   fieldArray: {
    //     fieldGroup: [
    //       {
    //         key: 'officeArr',
    //         type: 'select',
    //         templateOptions: {
    //           placeholder: 'Office Name',
    //         },
    //       },
    //     ],
    //   },
    // },

  ];

  constructor(
    private branchesService: BranchesService,
    private activatedRoute: ActivatedRoute
  ) {}

  submit() {
    console.log(this.branchForm.value);
  }

  cancel() {

  }

  save() {

  }

}
