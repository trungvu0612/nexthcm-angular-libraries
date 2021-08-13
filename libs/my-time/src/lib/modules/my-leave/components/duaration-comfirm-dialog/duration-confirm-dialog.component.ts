import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { SubmitLeavePayLoad } from '../../../../models';

@Component({
  selector: 'hcm-duration-confirm-dialog',
  templateUrl: './duration-confirm-dialog.component.html',
  styleUrls: ['./duration-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationConfirmDialogComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean, SubmitLeavePayLoad>) {}

  get data(): SubmitLeavePayLoad {
    return this.context.data;
  }

  cancel() {
    this.context.$implicit.complete();
  }

  oKe() {
    this.context.completeWith(true);
  }
}
