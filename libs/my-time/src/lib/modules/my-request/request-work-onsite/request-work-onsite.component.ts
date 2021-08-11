import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SubmitRequest } from '../../../models';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MyRequestService } from '../../../services';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'hcm-request-work-onsite',
  templateUrl: './request-work-onsite.component.html',
  styleUrls: ['./request-work-onsite.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestWorkOnsiteComponent implements OnInit {
  form = new FormGroup<any>({});
  model!: SubmitRequest;
  myId = this.authService.get('userInfo').userId;
  type = '';
  requestForm!: FormGroup<SubmitRequest>;

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
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
        }
      ]
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'sendTo',
          type: 'select',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Send To',
            valueProp: 'value',
            options: [{ label: 'Nguyen Thanh Son', value: '557e6ff6-87ab-463e-a46c-2338f64c521a' }]
          }
        },
        {
          key: 'duration',
          type: 'input-time',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Duration'
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
        placeholder: 'Comment'
      }
    }
  ];

  constructor(
    private formbuilder: FormBuilder,
    private requestService: MyRequestService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown>
  ) {
    this.requestForm = this.formbuilder.group<SubmitRequest>({});
  }

  ngOnInit(): void {

  }

  submit(): void {
    if (this.requestForm.valid) {
      const formModel = this.requestForm.value;
      const newFromDate = (formModel.fromDate as TuiDay).toLocalNativeDate().valueOf();
      const newToDate = (formModel.toDate as TuiDay).toLocalNativeDate().valueOf();
      const newDuration = (formModel?.duration as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;

      const { fromDate, toDate, ...dataToSubmit } = this.requestForm.value;
      const obj = {
        ...dataToSubmit,
        fromDate: newFromDate,
        toDate: newToDate,
        duration: newDuration
      };
      delete obj['sendTo'];
      if (this.type === 'ot') {
        obj.userId = this.myId;
        obj.comment = formModel.comment;
      }
      this.context.completeWith(obj);
    }
  }

  close(): void {
    this.context.$implicit.complete();
  }
}
