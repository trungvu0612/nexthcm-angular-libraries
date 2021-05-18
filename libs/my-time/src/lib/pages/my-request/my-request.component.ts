import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { MyRequestData } from '../../models/my-time';

@Component({
  selector: 'hcm-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRequestComponent implements OnInit {
  activeItemIndex = 0;
  inputDate = new FormControl();
  columns = ['fromDate', 'toDate', 'spentTime', 'status', 'reason', 'sentTo', 'action'];
  data: MyRequestData[] = [
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 5.3,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Waiting',
      reason: 'Em xin nghỉ phép đi chơi...',
      comment: 'Em xin nghỉ phép đi chơi...',
      sentTo: 'Nguyen Hai Vien',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 8,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Approved',
      reason: 'Em xin nghỉ 1 ngày phép',
      comment: 'Em xin nghỉ 1 ngày phép',
      sentTo: 'Nguyen Vu Hoang Cuong',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Rejected',
      reason: 'Em xin nghỉ phép để làm đám cứ...',
      comment: 'Em xin nghỉ phép để làm đám cứ...',
      sentTo: 'Vu Thinh',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 5.3,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Cancelled',
      reason: 'Em xin nghỉ phép đi chơi...',
      comment: 'Em xin nghỉ phép đi chơi...',
      sentTo: 'Nguyen Hai Vien',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 5.3,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Waiting',
      reason:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto laboriosam magnam maiores, molestias quasi quos totam voluptates! Dolore facere natus nostrum quam sunt tempore. Delectus deleniti id ipsa quo!',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex iusto laboriosam magnam maiores, molestias quasi quos totam voluptates! Dolore facere natus nostrum quam sunt tempore. Delectus deleniti id ipsa quo!',
      sentTo: 'Nguyen Hai Vien',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 5.3,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Waiting',
      reason: 'Em xin nghỉ phép đi chơi...',
      comment: 'Em xin nghỉ phép đi chơi...',
      sentTo: 'Nguyen Hai Vien',
    },
    {
      office: 'Copac',
      date: new Date(2020, 9, 26),
      fromDate: new Date(2020, 9, 26),
      toDate: new Date(2020, 9, 26),
      spentTime: 5.3,
      day: 0.5,
      timeIn: '07:13',
      totalTime: 10,
      status: 'Waiting',
      reason: 'Em xin nghỉ phép đi chơi...',
      comment: 'Em xin nghỉ phép đi chơi...',
      sentTo: 'Nguyen Hai Vien',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.data.forEach((item) => {
      item.title = 'Overtime Detail';
    });
  }

  onChangeTab(key: string): void {
    switch (key) {
      case 'overTime':
        this.columns = ['fromDate', 'toDate', 'spentTime', 'status', 'reason', 'sentTo', 'action'];
        this.data.forEach((item) => {
          item.title = 'Overtime Detail';
          item.group = 'overTime';
        });
        break;
      case 'updateTime':
        this.columns = ['office', 'date', 'dayOfWeek', 'timeIn', 'timeOut', 'totalTime', 'status', 'comment', 'action'];
        this.data.forEach((item) => {
          item.title = 'Working Outside Detail';
          item.group = 'updateTime';
        });
        break;
      default:
        this.columns = ['fromDate', 'toDate', 'day', 'status', 'reason', 'sentTo', 'action'];
        this.data.forEach((item) => {
          item.title = 'Working Outside Detail';
          item.group = 'workingOutside';
        });
    }
  }
}
