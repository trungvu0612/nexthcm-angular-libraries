import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SubmitRequest } from '../../../models';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MyLeaveService, MyRequestService } from '../../../services';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { TranslocoService } from '@ngneat/transloco';

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
            placeholder: this.translocoService.translate('WORKING_OUTSIDE_MANAGEMENT.fromDate')
          }
        },
        {
          key: 'toDate',
          type: 'input-date',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: this.translocoService.translate('WORKING_OUTSIDE_MANAGEMENT.toDate')
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
            placeholder: this.translocoService.translate('WORKING_OUTSIDE_MANAGEMENT.assignedName'),
            options: this.myLeaveService.select('sendToUsers'),
            labelProp: 'username',
            valueProp: 'id'
          }
        },
        {
          key: 'duration',
          type: 'input-time',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: this.translocoService.translate('duration')
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
        placeholder: this.translocoService.translate('reason')
      }
    }
  ];

  constructor(
    private formbuilder: FormBuilder,
    private requestService: MyRequestService,
    private myLeaveService: MyLeaveService,
    private translocoService: TranslocoService,
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
