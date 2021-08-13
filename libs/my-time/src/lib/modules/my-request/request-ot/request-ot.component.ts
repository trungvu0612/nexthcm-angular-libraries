import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { SubmitRequest } from '../../../models/requests';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { MyLeaveService, MyRequestService } from '../../../services';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { OTEnum } from '../../../enums/ot';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-request-ot-wfh',
  templateUrl: './request-ot.component.html',
  styleUrls: ['./request-ot.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestOtComponent {
  form = new FormGroup<any>({});
  model!: SubmitRequest;
  myId = this.authService.get('userInfo').userId;
  requestForm!: FormGroup<SubmitRequest>;

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'type',
          type: 'select',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: this.translocoService.translate('type'),
            options: [
              { label: this.translocoService.translate('overtime'), value: OTEnum.OVERTIME },
              { label: this.translocoService.translate('workAfterTime'), value: OTEnum.WORKING_AFTERTIME }],
            valueProp: 'value'
          }
        }
      ]
    },
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
      key: 'comment',
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
    private destroy$: TuiDestroyService,
    private myLeaveService: MyLeaveService,
    private translocoService: TranslocoService,
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
      obj.userId = this.myId;
      obj.comment = formModel.comment;
      this.context.completeWith(obj);
    }
  }

  close(): void {
    this.context.$implicit.complete();
  }
}
