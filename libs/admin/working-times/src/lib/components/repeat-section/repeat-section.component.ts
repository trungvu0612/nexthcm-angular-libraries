import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatSectionComponent extends FieldArrayType {}
