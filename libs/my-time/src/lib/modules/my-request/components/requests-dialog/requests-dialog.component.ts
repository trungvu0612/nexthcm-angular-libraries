import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Requests } from '../../../../models/requests';

@Component({
  selector: 'hcm-requests-dialog',
  templateUrl: './requests-dialog.component.html',
  styleUrls: ['./requests-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsDialogComponent implements OnInit {
  title = 'Default Title';
  requestForm!: FormGroup<Requests>;
  model!: Requests;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'userId' },
    {
      key: 'employee',
      fieldGroup: [
        {
          key: 'id',
          type: 'select',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Send To',
            options: [{ label: 'Manager', value: 'iron_man' }],
          },
        },
      ],
    },
    {
      key: 'fromDate',
      type: 'input-date',
      templateOptions: {
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'From Date',
      },
    },
    {
      key: 'toDate',
      type: 'input-date',
      templateOptions: {
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'To Date',
      },
    },
    {
      key: 'reason',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Reason',
      },
    },
  ];

  constructor(
    private formbuilder: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean, Requests>
  ) {
    // this.requestForm = this.formbuilder.group<Requests>({
    //   type: '',
    //   userId: '',
    //   fromDate: 0,
    //   toDate: 0,
    //   reason: ''
    // });
  }

  ngOnInit(): void {}

  submit(): void {
    this.context.completeWith(true);
  }

  close(): void {
    this.context.completeWith(false);
  }
}
