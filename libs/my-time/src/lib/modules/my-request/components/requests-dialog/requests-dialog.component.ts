import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import { SubmitRequest } from '../../../../models';
import { MyLeaveService, MyRequestService } from '../../../../services';

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
            // required: true,
            placeholder: 'WORKING_OUTSIDE_MANAGEMENT.assignedName',
            options: this.myLeaveService.select('sendToUsers'),
            labelProp: 'username',
            valueProp: 'id',
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
        placeholder: 'reason',
      },
    },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private requestService: MyRequestService,
    private myLeaveService: MyLeaveService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown>
  ) {
    this.requestForm = this.formbuilder.group<SubmitRequest>({});
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.requestForm.valid) {
      const formModel = this.requestForm.value;
      const newFromDate = (formModel.fromDate as TuiDay).toLocalNativeDate().valueOf();
      const newToDate = endOfDay((formModel.toDate as TuiDay).toLocalNativeDate().valueOf());

      const { fromDate, toDate, ...dataToSubmit } = this.requestForm.value;
      const obj = {
        ...dataToSubmit,
        fromDate: newFromDate,
        toDate: newToDate,
      };
      obj.userId = this.myId;
      this.context.completeWith(obj);
    }
  }

  close(): void {
    this.context.$implicit.complete();
  }
}
