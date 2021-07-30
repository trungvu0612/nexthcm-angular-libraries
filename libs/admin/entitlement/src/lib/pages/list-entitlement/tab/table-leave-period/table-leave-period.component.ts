import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { LeaveStatus } from '../../../../enums/status';
import { CreateLeavePeriodComponent } from '../../dialog/create-leave-period/create-leave-period.component';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { AdminPeriodService } from '../../../../services/admin-period.service';
import { AdminEntitlementService } from '../../../../services/admin-entitlement.service';

@Component({
  selector: 'hcm-table-leave-period',
  templateUrl: './table-leave-period.component.html',
  styleUrls: ['./table-leave-period.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableLeavePeriodComponent implements OnInit {
  readonly LeaveStatus = LeaveStatus;

  dateControl = new FormControl<Date>();
  columns = ['date', 'leaveType', 'days', 'status', 'sendTo', 'action'];

  data: any = [];
  page$ = new BehaviorSubject<number>(1);
  size$ = 10;

  perPageSubject = new BehaviorSubject<number>(this.size$);
  totalElements = 0;
  page = 0;
  size = 10;

  constructor(
    private adminEntitlementService: AdminEntitlementService,
    private adminPeriodService: AdminPeriodService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const request$ = combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.adminPeriodService.getAdminPeriods(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        this.data = item.data.items;
        console.log('dataa', this.data);
        this.totalElements = item.data.totalElements;
        this.cdr.detectChanges();
      });
  }

  cancel(): void {
    console.log('cancel');
  }

  onPage($event: number) {
    this.page$.next($event);
  }

  onSize($event: number) {
    this.size$ = $event;
  }

  showDialogSubmit() {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(CreateLeavePeriodComponent, this.injector), {})
      .subscribe((result) => {
        if (result) {
          console.log('dataaaaaaa', result);
          this.adminPeriodService.createAdminPeriodId(result).subscribe((data) => {
            console.log('Success Post');
          });
        }
      });
  }

  delete(id: string): void {
    if (id) {
      this.adminPeriodService.deleteAdminPeriodId(id).subscribe((data) => {
        console.log('Delete sucesss');
      });
    }
  }


}
