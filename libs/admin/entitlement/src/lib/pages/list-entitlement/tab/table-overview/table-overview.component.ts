import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { MyLeave } from '../../../../../../../../my-time/src/lib/models/my-leave';
import { BehaviorSubject } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { LeaveStatus } from '../../../../enums/status';
import { FormControl } from '@ngneat/reactive-forms';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateLeaveEntitlementComponent } from '../../dialog/create-leave-entitlement/create-leave-entitlement.component';

@Component({
  selector: 'hcm-table-overview-entitlement',
  templateUrl: './table-overview.component.html',
  styleUrls: ['./table-overview.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableOverviewComponent implements OnInit {

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
  ) {
  }

  ngOnInit(): void {

  }

  cancel(): void {
    console.log('cancel');
  }

  onPage($event: number) {
    this.page$.next($event);
    // console.log(this.pages$.getValue());
  }

  onSize($event: number) {
    this.size$ = $event;
    // console.log(this.size$);
  }

  showDialogSubmit() {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(CreateLeaveEntitlementComponent, this.injector), {
        closeable: false
      })
      .subscribe((data) => {
        // console.log('check data outside dialog', data);
        // this.myLeaveService.createLeave(data).subscribe((data) => {
        //   console.log('susscess post');
        // });
      });
  }
}
