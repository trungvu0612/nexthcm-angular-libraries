import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { LeavePeriod } from '../../../../../models/leave-period';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AdminPeriodService } from '../../../../../services/admin-period.service';
import { toDate } from 'date-fns'
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-edit-leave-period',
  templateUrl: './edit-leave-period.component.html',
  styleUrls: ['./edit-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLeavePeriodComponent implements OnInit {

  data = this.context.data || '';

  readonly form = new FormGroup({});
  model: Partial<LeavePeriod> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'startDateEdit',
          type: 'input-date',
          templateOptions: {
            label: 'startDate',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'endDateEdit',
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
    console.log('iddddd data', this.data);
    if (this.data !== '') {
      this.adminPeriodService.getAdminPeriodId(this.data).subscribe((item) => {
        console.log('aaaaaaaaaaa', item);
        this.model = { ...this.model, ...item };
        if (item.startDate && item.endDate){
          this.model.startDateEdit = toDate(item.startDate);
          this.model.endDateEdit = toDate(item.endDate);
        }
      });
    }
  }

  ngAfterViewInit() {
    // const policiesControl = this.adminUserRoleForm.get('policies');
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
