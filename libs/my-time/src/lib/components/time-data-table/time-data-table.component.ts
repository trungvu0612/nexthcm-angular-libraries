import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { MyLeave } from '../../models/myLeave';
import { LeaveDetailDialogComponent } from '../leave-detail-dialog/leave-detail-dialog.component';

@Component({
  selector: 'hcm-time-data-table',
  templateUrl: './time-data-table.component.html',
  styleUrls: ['./time-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeDataTableComponent implements OnInit {
  @Input() columns!: string[];
  data: MyLeave[] = [
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
    {
      date: new Date(2020, 9, 26),
      leaveType: 'Paid Leave',
      days: 5.3,
      status: 'Waiting',
      comments: 'Em xin nghỉ phép để đi chơi ạ',
      sendTo: 'Nguyen Hai Vien',
    },
  ];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  cancel(): void {
    console.log('cancel');
  }

  showDialog(item: MyLeave) {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(LeaveDetailDialogComponent, this.injector), {
        closeable: false,
        data: item,
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
