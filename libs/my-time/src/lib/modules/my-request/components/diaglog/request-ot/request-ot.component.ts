import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Requests } from '../../../../../models/requests';
import { FormGroup } from '@ngneat/reactive-forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-request-ot-wfh',
  templateUrl: './request-ot.component.html',
  styleUrls: ['./request-ot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestOtComponent implements OnInit {
  id!: string;
  data = this.context.data || '';
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
            valueProp: 'value',
            options: [{ label: 'Nguyen Thanh Son', value: 'e08eb04d-a430-4e03-b017-e46f865e648d' }],
          },
        },
      ],
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
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, Requests>,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    console.log('iddddd data', this.data);
  }

  submit() {
    // if (this.model.stateCov) {
    //   this.model.state = 1;
    // } else {
    //   this.model.state = 0;
    // }
    // const body: JobTitle = {
    //   name: this.model.name,
    //   description: this.model.description,
    //   hasLevel: this.model.hasLevel,
    //   state: this.model.state,
    // };
    this.context.completeWith(this.model);
  }

  cancel() {
    this.context.completeWith(false);
  }

  save() {}
}
