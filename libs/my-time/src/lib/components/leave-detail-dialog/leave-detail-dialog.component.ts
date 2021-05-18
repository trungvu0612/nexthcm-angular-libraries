import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { MyLeave } from '../../models/myLeave';

@Component({
  selector: 'hcm-leave-detail-dialog',
  templateUrl: './leave-detail-dialog.component.html',
  styleUrls: ['./leave-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveDetailDialogComponent implements OnInit {

  item: MyLeave | undefined = this.context.data;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>) {}

  ngOnInit(): void {
  }

  cancel() {
    this.context.completeWith(true);
  }

  close() {
    this.context.completeWith(false);
  }

}
