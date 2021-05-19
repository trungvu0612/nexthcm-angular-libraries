import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { MyRequestData } from '../../models/my-time';

@Component({
  selector: 'hcm-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDialogComponent {
  item: MyRequestData = this.context.data as unknown as MyRequestData;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean>) {}

  cancel(): void {
    this.context.completeWith(true);
  }

  close(): void {
    this.context.completeWith(false);
  }
}
