import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { SubmitRequest } from '../../models/requests';
import { MyRequestService } from '../../services/my-request.service';

@Component({
  selector: 'hcm-requests-dialog',
  templateUrl: './requests-dialog.component.html',
  styleUrls: ['./requests-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestsDialogComponent implements OnInit {
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
      ],
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
            options: [{ label: 'Nguyen Thanh Son', value: 'e08eb04d-a430-4e03-b017-e46f865e648d' }],
          },
        },
        {
          key: 'duration',
          type: 'input-time',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Duration',
          },
        },
      ],
    },

    {
      key: 'comment',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Comment',
      },
    },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private requestService: MyRequestService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, { type: string }>
  ) {
    this.requestForm = this.formbuilder.group<SubmitRequest>({});
  }

  ngOnInit(): void {
    this.type = this.context.data.type;
  }

  submit(): void {
    if (this.requestForm.valid) {
      const formModel = this.requestForm.value;
      const newFromDate = (formModel.fromDate as TuiDay).toLocalNativeDate().valueOf();
      const newToDate = (formModel.toDate as TuiDay).toLocalNativeDate().valueOf();
      const newDuration = (formModel?.duration as TuiTime).toAbsoluteMilliseconds().valueOf();

      const { fromDate, toDate, ...dataToSubmit } = this.requestForm.value;
      const obj = {
        ...dataToSubmit,
        fromDate: newFromDate,
        toDate: newToDate,
        duration: newDuration,
      };
      delete obj['sendTo'];
      if (this.type === 'ot') {
        obj.userId = this.myId;
        obj.sendTo = '557e6ff6-87ab-463e-a46c-2338f64c521a';
        obj.comment = formModel.comment;
      }
      this.context.completeWith(obj);
    }
  }

  close(): void {
    this.context.$implicit.complete();
  }
}
