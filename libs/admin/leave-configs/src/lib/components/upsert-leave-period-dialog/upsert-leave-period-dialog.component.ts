import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { toDate } from 'date-fns';
import { LeavePeriod } from '../../models/leave-period';

@Component({
  selector: 'hcm-upsert-leave-period-dialog',
  templateUrl: './upsert-leave-period-dialog.component.html',
  styleUrls: ['./upsert-leave-period-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeavePeriodDialogComponent implements OnInit {
  form = this.fb.group<LeavePeriod>({} as LeavePeriod);
  model = {} as LeavePeriod;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'tenantId', defaultValue: this.authService.get('userInfo', 'tenantId') },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'startDate',
          type: 'input-date',
          templateOptions: {
            translate: true,
            labelClassName: 'font-semibold',
            label: 'startDate',
            required: true,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'endDate',
          type: 'input-date',
          templateOptions: {
            translate: true,
            labelClassName: 'font-semibold',
            label: 'endDate',
            required: true,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LeavePeriod, LeavePeriod>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const item = this.context.data;
    if (item) {
      this.model = { ...this.model, ...item };
      if (item.startDate && item.endDate) {
        this.model.startDate = TuiDay.fromLocalNativeDate(toDate(item.startDate as number));
        this.model.endDate = TuiDay.fromLocalNativeDate(toDate(item.endDate as number));
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}



