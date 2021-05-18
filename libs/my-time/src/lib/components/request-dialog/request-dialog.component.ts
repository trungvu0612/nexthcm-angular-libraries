import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { MyRequestData } from '../../models/my-time';

@Component({
  selector: 'hcm-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDialogComponent {
  item: MyRequestData | undefined = this.context.data;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean>) {}

  cancel(): void {
    this.context.completeWith(true);
  }

  close(): void {
    this.context.completeWith(false);
  }
}
