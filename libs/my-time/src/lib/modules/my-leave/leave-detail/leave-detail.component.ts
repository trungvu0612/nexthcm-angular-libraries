import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave.service';
import { PartialObserver } from 'rxjs';
import { PromptService } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveDetailComponent implements OnInit {
  myId = this.activatedRoute.snapshot.params.id;
  leaveRequestType = 'employee';
  showDropdown = true;
  open = false;
  primary = 'Full Day (8:30 - 17:30)';
  readonly leaveType = [['Half Day (8:30 - 12:30)', 'Full Day (8:30 - 17:30)']];
  activeItemIndex = 0;
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

  onClick(item: string): void {
    this.showDropdown = !this.showDropdown;
    if (this.leaveType[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
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
      const body = { status: -1 };
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
