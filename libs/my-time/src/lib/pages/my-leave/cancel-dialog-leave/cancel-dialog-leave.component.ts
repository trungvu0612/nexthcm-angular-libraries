import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { MyLeaveService } from '../../../services/my-leave/my-leave.service';

@Component({
  selector: 'hcm-cancel-dialog-leave',
  templateUrl: './cancel-dialog-leave.component.html',
  styleUrls: ['./cancel-dialog-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelDialogLeaveComponent implements OnInit {
  dataId = this.context.data || '';
  // data$: Observable<MyLeave> = this.myLeaveService.getLeave(this.dataId).pipe(map((data) => data.data));

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>,
    private myLeaveService: MyLeaveService
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.context.completeWith(false);
  }

  close() {
    this.context.completeWith(false);
  }

  delete() {
    this.context.completeWith(true);
  }
}
