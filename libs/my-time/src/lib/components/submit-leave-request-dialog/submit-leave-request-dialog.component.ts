import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiBooleanHandler } from '@taiga-ui/cdk';
import { SubmitLeaveService } from '../../services/submit-leave/submit-leave.service';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitLeaveRequestDialogComponent {
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  // form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'fromDate',
      type: 'input-date',
      templateOptions: {
        label: 'From Date',
        placeholder: 'From Date',
        description: 'From Date',
        required: true,
      },
    },

    {
      key: 'toDate',
      type: 'input-date',
      templateOptions: {
        label: 'To Date',
        placeholder: 'To Date',
        description: 'To Date',
        required: true,
      },
    },

    {
      key: 'select',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'aaaaaaaaaaaaaaa' },
          { id: 2, name: 'bbbbbbbbbbbbb' },
          { id: 3, name: 'ccccccccccccc' },
        ],
        labelProp: 'name',
        valueProp: 'id',
      },
    },

    {
      key: 'fromDatee',
      type: 'combo-box',
      templateOptions: {
        label: '',
        placeholder: '',
        serverRequest: this.submitLeaveService.get,
        imagePath: '/',
      },
    },

    {
      className: 'col-span-full',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        textfieldSize: 'l',
        expandable: false,
        rows: 4,
      },
    },
  ];

  readonly items = ['News', 'Food', 'Clothes', 'Popular', 'Goods', 'Furniture', 'Tech', 'Building materials'];

  constructor(private submitLeaveService: SubmitLeaveService) {}

  disabledItemHandler: TuiBooleanHandler<string> = (item) => item.length < 7;

  test(event: any): void {
    this.form.controls.filters.setValue([]);
  }
}
