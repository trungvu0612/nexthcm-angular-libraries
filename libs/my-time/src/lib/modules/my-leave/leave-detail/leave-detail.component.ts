import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyLeaveService } from '../../../services/my-leave.service';
import { Observable, PartialObserver } from 'rxjs';
import { PromptService } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';
import { Requests } from '../../../models/requests';
import { map } from 'rxjs/operators';

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
  dataRequest$: Observable<Requests> = this.myLeaveService.getRequestDetail(this.myId).pipe(map((data) => data.data));

  leaveRequestType = 'employee';
  showDropdown = true;
  open = false;
  activeItemIndex = 0;
  constructor(
    private myLeaveService: MyLeaveService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('request-management')) {
      this.leaveRequestType = 'manager';
    }
  }

  approveLeaveRequest(id: string) {
    if (id) {
      const body = { status: 1 };
      this.myLeaveService.editLeave(id, body).subscribe(this.handleResponse('MY_TIME.approveLeave'));
    }
  }

  rejectLeaveRequest(id: string) {
    if (id) {
      const body = { status: -1, reason: '' };
      this.myLeaveService.editLeave(id, body).subscribe(this.handleResponse('MY_TIME.rejectLeave'));
    }
  }

  private handleResponse(successfulText: string): PartialObserver<unknown> {
    return {
      next: () =>
        this.promptService.open({
          icon: 'success',
          text: this.translocoService.translate(successfulText),
        }),
    };
  }
}
