import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { MyLeave } from '../../models/my-leave';
import { LeaveDetailDialogComponent } from '../../pages/my-leave/leave-detail-dialog/leave-detail-dialog.component';
import { MyLeaveService } from '../../services/my-leave/my-leave.service';

@Component({
  selector: 'hcm-time-data-table',
  templateUrl: './time-data-table.component.html',
  styleUrls: ['./time-data-table.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeDataTableComponent implements OnInit {
  @Input() columns!: string[];
  data: MyLeave[] = [
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
    // {
    //   date: new Date(2020, 9, 26),
    //   leaveType: 'Paid Leave',
    //   days: 5.3,
    //   status: 'Waiting',
    //   comments: 'Em xin nghỉ phép để đi chơi ạ',
    //   sendTo: 'Nguyen Hai Vien',
    // },
  ];

  page$ = new BehaviorSubject<number>(1);
  totalLength = 0;
  size$ = 10;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private myLeaveService: MyLeaveService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.myLeaveService.getMyLeaves(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        console.log('itemmmmmmmmmm', item);

        console.log('leave typeeee', item.data.items[0].leaveType?.name);

        this.data = item.data.items;
        this.totalLength = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }

  cancel(): void {
    console.log('cancel');
  }

  showDialog(id: string): void {
    console.log('Len popupppppp');

    this.dialogService
      .open<boolean>(new PolymorpheusComponent(LeaveDetailDialogComponent, this.injector), {
        closeable: false,
        data: [],
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
