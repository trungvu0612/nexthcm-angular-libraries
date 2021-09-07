import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { LevelApprove } from '../../../../../leave-level-approve/src/lib/models/level-approve';
import { LeaveConfigsService } from '../../leave-configs.service';

@Component({
  selector: 'hcm-upsert-leave-level-approve',
  templateUrl: './upsert-leave-level-approve.component.html',
  styleUrls: ['./upsert-leave-level-approve.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveLevelApproveComponent implements OnInit {
  form = this.fb.group<LevelApprove>({} as LevelApprove);
  model = {} as LevelApprove;
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
        label: 'Job Titles',
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
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LevelApprove, LevelApprove>,
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
