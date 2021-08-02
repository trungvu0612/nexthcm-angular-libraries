import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { LeaveStatus } from '../../../enums/status';
import { MyLeave } from '../../../models/my-leave';
import { MyLeaveService } from '../../../services/my-leave.service';
import { CancelDialogLeaveComponent } from '../cancel-dialog-leave/cancel-dialog-leave.component';
import { LeaveDetailDialogComponent } from '../leave-detail-dialog/leave-detail-dialog.component';
import { SubmitLeaveRequestDialogComponent } from '../submit-leave-request-dialog/submit-leave-request-dialog.component';

@Component({
  selector: 'hcm-leave-request-management',
  templateUrl: './leave-request-management.component.html',
  styleUrls: ['./leave-request-management.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveRequestManagementComponent implements OnInit {
  readonly LeaveStatus = LeaveStatus;

  dateControl = new FormControl<Date>();
  columns = ['fromDate', 'toDate', 'leaveType', 'days', 'status', 'comment', 'action'];

  data: MyLeave[] = [];

  page$ = new BehaviorSubject<number>(1);
  size$ = 10;

  perPageSubject = new BehaviorSubject<number>(this.size$);
  totalElements = 0;
  page = 0;
  size = 10;

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private myLeaveService: MyLeaveService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.myLeaveService.getMyLeaves(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.data = item.data.items;
        this.totalElements = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }

  cancel(): void {
    console.log('cancel');
  }

  showDialog(id: string): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(LeaveDetailDialogComponent, this.injector), {
        closeable: false,
        data: id,
      })
      .subscribe((data) => {
        if (data) {
          const body = {
            status: 0,
          };
          this.myLeaveService.editLeave(id, body).subscribe((data) => {
            console.log('susscess edit', id);
          });
        }
      });
  }

  showLeaveDetail(leaveId: string): void {
    this.router.navigateByUrl(`/my-time/my-leave/${leaveId}/detail`);
  }

  showDialogSubmit() {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
        closeable: false,
      })
      .subscribe((data) => {
        console.log('check data outside dialog', data);
        this.myLeaveService.createLeave(data).subscribe((data) => {
          console.log('susscess post');
        });
      });
  }

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
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
