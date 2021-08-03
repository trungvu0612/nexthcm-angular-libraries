import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLeave } from '../../../models/my-leave';
import { MyLeaveService } from '../../../services/my-leave.service';

@Component({
  selector: 'hcm-leave-detail-dialog',
  templateUrl: './leave-detail-dialog.component.html',
  styleUrls: ['./leave-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveDetailDialogComponent implements OnInit {
  STATUS: { [key: string]: string } = {
    '-1': 'rejected',
    '1': 'approved',
    '0': 'cancelled',
    '2': 'waiting',
    '3': 'taken',
    '4': 'weekend',
    '5': 'holiday',
  };

  dataId = this.context.data || '';
  dataRes?: any;

  data$: Observable<MyLeave> = this.myLeaveService.getLeave(this.dataId).pipe(map((data) => data.data));

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>,
    private myLeaveService: MyLeaveService
  ) {}

  ngOnInit(): void {}

  edit(id: string): void {
    this.context.completeWith(true);
  }

  cancel() {
    this.context.completeWith(false);
  }

  close() {
    this.context.$implicit.complete();
  }
}
