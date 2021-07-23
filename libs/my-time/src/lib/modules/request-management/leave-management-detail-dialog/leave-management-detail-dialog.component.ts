import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLeave } from '../../../models/my-leave';
import { LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave.service';

@Component({
  selector: 'hcm-leave-management-detail-dialog',
  templateUrl: './leave-management-detail-dialog.component.html',
  styleUrls: ['./leave-management-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveManagementDetailDialogComponent implements OnInit {
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '1': 'approved',
    '0': 'cancelled',
    '2': 'waiting',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday',
  };
  showDropdown = true;
  open = false;
  primary = 'Full Day (8:30 - 17:30)';
  readonly leaveType = [['Half Day (8:30 - 12:30)', 'Full Day (8:30 - 17:30)']];
  activeItemIndex = 0;
  dataId = this.context.data || '';
  dataRes?: any;
  data$: Observable<MyLeave> = this.myLeaveService.getLeave(this.dataId).pipe(map((data) => data.data));

  form = new FormGroup<LeaveSubmit | any>({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'w-72',
      key: 'startTime',
      type: 'input-date',
      templateOptions: {
        label: 'From Date',
        placeholder: 'From Date',
        description: 'From Date',
        required: true,
      },
    },
    {
      className: 'ml-4 w-72',
      key: 'endTime',
      type: 'input-date',
      templateOptions: {
        label: 'To Date',
        placeholder: 'To Date',
        description: 'To Date',
        required: true,
      },
    },
    {
      className: 'ml-4 w-72',
      key: 'sendTo',
      type: 'select',
      templateOptions: {
        options: [],
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Choose staff',
      },
    },
  ];

  // formAssign = new FormGroup<LeaveSubmit | any>({});
  // modelAssign = {};
  // fieldAssign: FormlyFieldConfig[] = [
  //   {
  //     key: 'sendTo',
  //     type: 'select',
  //     templateOptions: {
  //       options: [],
  //       labelProp: 'username',
  //       valueProp: 'id',
  //       placeholder: 'Send to',
  //     },
  //   },
  // ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>,
    private myLeaveService: MyLeaveService
  ) {}

  ngOnInit(): void {}

  onClick(item: string): void {
    this.showDropdown = !this.showDropdown;
    if (this.leaveType[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  edit(id: string): void {
    this.context.completeWith(true);
  }

  cancel() {
    this.context.completeWith(false);
  }

  close() {
    this.context.completeWith(false);
  }
}
