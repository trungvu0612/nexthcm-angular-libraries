import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { LeavePeriod } from '../../../../models/leave-period';
import { AdminPeriodService } from '../../../../services/admin-period.service';

@Component({
  selector: 'hcm-create-leave-period',
  templateUrl: './create-leave-period.component.html',
  styleUrls: ['./create-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeavePeriodComponent implements OnInit {

  data = this.context.data || '';

  readonly form = new FormGroup({});
  model: Partial<LeavePeriod> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'startDate',
          type: 'input-date',
          templateOptions: {
            label: 'startDate',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'endDate',
          type: 'input-date',
          templateOptions: {
            label: 'endDate',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeavePeriod>,
    private adminPeriodService: AdminPeriodService,
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  submit() {
    console.log('this.model', this.model)
    if (this.model){
      if (this.model.startDate && this.model.endDate){
        this.model.orgId = 'b4b49d56-931a-4320-b9eb-7fb3dbd757f5'
        this.model.name = this.model.startDate.toString() + ' - ' + this.model.endDate.toString()
        this.context.completeWith(this.model);
      }
    }
  }

  cancel() {
    this.context.completeWith(false);
  }
}
