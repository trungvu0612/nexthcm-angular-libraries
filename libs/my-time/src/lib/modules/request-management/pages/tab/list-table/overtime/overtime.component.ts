import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { LeaveStatus } from '../../../../../../enums/status';
import { MyLeave } from '../../../../../../models/my-leave';
import { CancelDialogLeaveComponent } from '../../../../../../pages/my-leave/cancel-dialog-leave/cancel-dialog-leave.component';
import { MyLeaveService } from '../../../../../../services/my-leave/my-leave.service';
import { LeaveManagementDetailDialogComponent } from '../../diaglog/leave-management-detail-dialog/leave-management-detail-dialog.component';

@Component({
  selector: 'hcm-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeComponent implements OnInit {
  readonly LeaveStatus = LeaveStatus;

  dateControl = new FormControl<Date>();
  columns = ['date', 'leaveType', 'days', 'status', 'sendTo', 'action'];

  data: MyLeave[] = [];

  page$ = new BehaviorSubject<number>(1);
  size$ = 10;
  totalLength = 100;
  perPageSubject = new BehaviorSubject<number>(this.size$);

  page = 0;
  size = 10;

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
        this.data = item.data.items;
        this.totalLength = item.data.totalElements + 10;
        this.cdr.detectChanges();
      });
  }

  cancel(): void {
    console.log('cancel');
  }

  showDialog(id: string): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(LeaveManagementDetailDialogComponent, this.injector), {
        closeable: false,
        data: id,
        size: 'l',
      })
      .subscribe((data) => {
        const body = {
          status: 0,
        };
        this.myLeaveService.editLeave(id, body).subscribe((data) => {
          console.log('susscess edit', id);
        });
      });
  }

  showDialogSubmit() {
    // this.dialogService
    //   .open<boolean>(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
    //     closeable: false,
    //   })
    //   .subscribe((data) => {
    //     console.log('check data outside dialog', data);
    //     this.myLeaveService.createLeave(data).subscribe((data) => {
    //       console.log('susscess post');
    //     });
    //   });
  }

  onPage($event: number) {
    this.page$.next($event);
    // console.log(this.page$.getValue());
  }

  onSize($event: number) {
    this.size$ = $event;
    // console.log(this.size$);
  }

  showDialogDelete(id: string) {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(CancelDialogLeaveComponent, this.injector), {
        closeable: false,
        data: id,
        size: 's',
      })
      .subscribe((data) => {
        this.myLeaveService.deleteLeave(id).subscribe((data) => {
          console.log('susscess delete', id);
        });
      });
  }
}