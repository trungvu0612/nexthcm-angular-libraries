import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import { WorkingHours } from '../../../../models';

@Component({
  selector: 'hcm-working-hour-detail',
  templateUrl: './working-hours-detail-dialog.component.html',
  styleUrls: ['./working-hours-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkingHoursDetailDialogComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<boolean, WorkingHours>) {}

  get data(): WorkingHours {
    return this.context.data;
  }
}
