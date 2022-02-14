import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-quartz-cron',
  templateUrl: './formly-quartz-cron.component.html',
  styleUrls: ['./formly-quartz-cron.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuartzCronComponent extends FieldType {}
