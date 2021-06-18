import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Requests } from '../../../../models/requests';
import { TuiDay } from '@taiga-ui/cdk';
import { MyRequestService } from '../../../../services/my-request.service';

@Component({
  selector: 'hcm-requests-dialog',
  templateUrl: './requests-dialog.component.html',
  styleUrls: ['./requests-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsDialogComponent implements OnInit {
  type = '';
  requestForm!: FormGroup<Requests>;
  model!: Requests;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [{
        key: 'fromDate',
        type: 'input-date',
        templateOptions: {
          textfieldLabelOutside: true,
          required: true,
          placeholder: 'From Date'
        }
      },
        {
          key: 'toDate',
          type: 'input-date',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'To Date'
          }
        }]
    },
    {
      key: 'employee',
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'id',
          type: 'select',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Send To',
            options: [{ label: 'Nguyen Thanh Son', value: 'e08eb04d-a430-4e03-b017-e46f865e648d' }]
          }
        }
      ]
    },
    {
      key: 'reason',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Reason'
      }
    }
  ];

  constructor(
    private formbuilder: FormBuilder,
    private requestService: MyRequestService,
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean, { type: string }>
  ) {
    this.requestForm = this.formbuilder.group<Requests>({});
  }

  ngOnInit(): void {
    this.type = this.context.data.type;
  }

  submit(): void {
    if (this.requestForm.valid) {
      const newFromDate = this.requestForm.value.fromDate as TuiDay;
      const newToDate = this.requestForm.value.toDate as TuiDay;
      const { fromDate, toDate, ...dataToSubmit } = this.requestForm.value;
      const obj = {
        ...dataToSubmit,
        fromDate: new Date(newFromDate.year, newFromDate.month, newFromDate.day),
        toDate: new Date(newToDate.year, newToDate.month, newToDate.day)
      };
      this.type === 'ot'
        ? this.requestService.createOTRequest(obj).subscribe(item => {
          console.log(item);
        })
        : this.requestService.createWorkingOutsideRequest(obj).subscribe(item => {
          console.log(item);
        })
      ;
    }
    this.context.completeWith(false);
  }

  close(): void {
    this.context.completeWith(true);
  }
}
