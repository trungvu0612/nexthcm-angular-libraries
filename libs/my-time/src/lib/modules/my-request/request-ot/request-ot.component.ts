import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Requests } from '../../../models/requests';
import { map } from 'rxjs/operators';
import { MyLeaveService } from '../../../services/my-leave.service';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-request-ot-wfh',
  templateUrl: './request-ot.component.html',
  styleUrls: ['./request-ot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestOtComponent {
  dataUsersReport$ = this.myLeaveService.getSendToUsers().pipe(map((res) => res.data.items));
  id!: string;
  form = new FormGroup<any>({});
  model: Requests = {};

  options: FormlyFormOptions = {};

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
      key: 'sendTo',
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'id',
          type: 'select',
          templateOptions: {
            textfieldLabelOutside: true,
            // required: true,
            placeholder: 'Send To',
            options: [{ label: 'Nguyen Thanh Son', value: 'e08eb04d-a430-4e03-b017-e46f865e648d' }],
            valueProp: 'value',
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
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, Requests>,
    private translocoService: TranslocoService,
    private myLeaveService: MyLeaveService
  ) {}

  submit(): void {
    if (this.form.valid) {
      const formModel = this.form.value;
      const obj = {
        fromDate: (formModel.fromDate as TuiDay).toLocalNativeDate().valueOf(),
        toDate: (formModel.toDate as TuiDay).toLocalNativeDate().valueOf(),
        comment: formModel.comment,
        sendTo: '934e5a26-8ade-4d3b-b7d9-28e11a1e4c2a',
      };
      this.context.completeWith(obj);
    }
  }

  cancel(): void {
    this.context.$implicit.complete();
  }
}
