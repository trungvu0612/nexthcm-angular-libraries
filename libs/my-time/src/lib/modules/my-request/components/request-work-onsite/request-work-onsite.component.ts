import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import { SubmitRequest } from '../../../../models';
import { MyLeaveService, MyRequestService } from '../../../../services';

@Component({
  selector: 'hcm-request-work-onsite',
  templateUrl: './request-work-onsite.component.html',
  styleUrls: ['./request-work-onsite.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestWorkOnsiteComponent {
  form = new FormGroup<any>({});
  model!: SubmitRequest;
  myId = this.authService.get('userInfo').userId;
  type = '';
  requestForm = this.fb.group<SubmitRequest>({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'fromDate',
          type: 'input-date',
          templateOptions: {
            translate: true,
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'WORKING_OUTSIDE_MANAGEMENT.fromDate',
          },
        },
        {
          key: 'toDate',
          type: 'input-date',
          templateOptions: {
            translate: true,
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'WORKING_OUTSIDE_MANAGEMENT.toDate',
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
            translate: true,
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'WORKING_OUTSIDE_MANAGEMENT.assignedName',
            options: this.myLeaveService.select('sendToUsers'),
            labelProp: 'username',
            valueProp: 'id',
          },
        },
        {
          key: 'duration',
          type: 'input-time',
          templateOptions: {
            translate: true,
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'duration',
          },
        },
      ],
    },

    {
      key: 'comment',
      type: 'text-area',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'comment',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: MyRequestService,
    private myLeaveService: MyLeaveService,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService,
    private authService: AuthService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown>
  ) {}

  submit(): void {
    if (this.requestForm.valid) {
      const formModel = this.requestForm.value;
      const newFromDate = (formModel.fromDate as TuiDay).toLocalNativeDate().valueOf();
      const newToDate = endOfDay((formModel.toDate as TuiDay).toLocalNativeDate().valueOf());
      const newDuration = (formModel?.duration as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;

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
        obj.comment = formModel.comment;
      }
      this.context.completeWith(obj);
    }
  }

  close(): void {
    this.context.$implicit.complete();
  }
}
