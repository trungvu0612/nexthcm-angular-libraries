import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { LeaveConfigsService } from '../../leave-configs.service';
import { LeaveApprovalLevel } from '../../models/leave-approval-level';

@Component({
  selector: 'hcm-upsert-leave-approval-level-dialog',
  templateUrl: './upsert-leave-approval-level-dialog.component.html',
  styleUrls: ['./upsert-leave-approval-level-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveApprovalLevelDialogComponent implements OnInit {
  form = this.fb.group<LeaveApprovalLevel>({} as LeaveApprovalLevel);
  model = {} as LeaveApprovalLevel;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'tenantId', defaultValue: this.authService.get('userInfo', 'tenantId') },
    {
      className: 'tui-form__row block',
      key: 'leaveType',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'leaveType',
        labelClassName: 'font-semibold',
        placeholder: 'chooseLeaveType',
        required: true,
        options: this.leaveConfigsService.select('leaveTypes'),
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
    {
      key: 'jobTitleDTOList',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'jobTitles',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.leaveConfigsService.select('jobTitles'),
        matcherBy: 'id',
      },
    },
    {
      className: 'tui-form__row block',
      key: 'totalLeave',
      type: 'input-number',
      templateOptions: {
        required: true,
        translate: true,
        label: 'totalLeave',
        labelClassName: 'font-semibold',
        placeholder: 'totalLeaveCanApprove',
        textfieldLabelOutside: true,
        precision: 0,
        min: 0,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LeaveApprovalLevel, LeaveApprovalLevel>,
    private fb: FormBuilder,
    private authService: AuthService,
    private leaveConfigsService: LeaveConfigsService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      if (formModel.jobTitleDTOList) {
        formModel.jobTitle = formModel.jobTitleDTOList.map((jobTitleDTO) => jobTitleDTO.id);
      }
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
