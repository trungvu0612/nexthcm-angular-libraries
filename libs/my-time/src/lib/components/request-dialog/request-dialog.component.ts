import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { MyRequestData } from '../../models/my-time';

@Component({
  selector: 'hcm-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDialogComponent implements OnInit {
  item: MyRequestData | undefined = this.context.data;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>) {}

  ngOnInit(): void {}

  cancel() {
    this.context.completeWith(true);
  }

  close() {
    this.context.completeWith(false);
  }
}
