import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RejectDialogComponent } from '../../../components/reject-dialog/reject-dialog.component';
import { Requests } from '../../../models/requests';
import { MyLeaveService } from '../../../services/my-leave.service';

@Component({
  selector: 'hcm-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveDetailComponent implements OnInit {
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '1': 'approved',
    '0': 'cancelled',
    '2': 'waiting',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday',
  };
  myId = this.activatedRoute.snapshot.params.id;
  dataRequest$: Observable<Requests> = this.myLeaveService.getRequestDetail(this.myId).pipe(
    catchError((err) => this.promptService.open({ icon: 'error', text: err.error.message })),
    map((data) => data.data)
  );

  leaveRequestType = 'employee';
  showDropdown = true;
  open = false;
  activeItemIndex = 0;

  constructor(
    private myLeaveService: MyLeaveService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private injector: Injector,
    private dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('request-management')) {
      this.leaveRequestType = 'manager';
    }
  }

  approveLeaveRequest(id: string) {
    if (id) {
      const body = { status: 1 };
      this.myLeaveService.editLeave(id, body).subscribe(this.promptService.handleResponse('MY_TIME.approveLeave'));
    }
  }

  showDialog(id: string): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RejectDialogComponent, this.injector), {
        closeable: false,
      })
      .pipe(switchMap((data) => this.myLeaveService.editLeave(id, data)))
      .subscribe(this.promptService.handleResponse('MY_TIME.rejectLeave'));
  }

  rejectLeaveRequest(id: string) {
    if (id) {
      const body = { status: -1, reason: '' };
      this.myLeaveService.editLeave(id, body).subscribe(this.promptService.handleResponse('MY_TIME.rejectLeave'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
