import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FieldArrayType } from '@ngx-formly/core';
import { tuiPure } from '@taiga-ui/cdk';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

@Component({
  selector: 'hcm-formly-daily-hour-config',
  templateUrl: './formly-daily-hour-config.component.html',
  styleUrls: ['./formly-daily-hour-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyDailyHourConfigComponent extends FieldArrayType {
  constructor(@Inject(TRANSLOCO_SCOPE) private translocoScope: ProviderScope) {
    super();
  }

  @tuiPure
  getDay(index: number): string {
    return `${this.translocoScope.scope}.${DAYS[this.formControl.value[index]['weekDayId'] - 1]}`;
  }
}
