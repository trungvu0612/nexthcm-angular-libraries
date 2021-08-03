import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-cancel-dialog-leave',
  templateUrl: './cancel-dialog-leave.component.html',
  styleUrls: ['./cancel-dialog-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelDialogLeaveComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>) {}

  cancel() {
    this.context.completeWith(false);
  }

  close() {
    this.context.$implicit.complete();
  }

  delete() {
    this.context.completeWith(true);
  }
}
