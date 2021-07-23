import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-duration-confirm-dialog',
  templateUrl: './duration-confirm-dialog.component.html',
  styleUrls: ['./duration-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationConfirmDialogComponent implements OnInit {
  data = this.context.data || '';

  constructor(@Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, any>) {}

  ngOnInit(): void {}

  cancel() {
    this.context.completeWith(false);
  }

  close() {
    this.context.completeWith(false);
  }

  oKe() {
    this.context.completeWith(true);
  }
}
