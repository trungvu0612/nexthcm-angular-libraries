import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-repeat-section',
  templateUrl: './formly-repeat-section.component.html',
  styleUrls: ['./formly-repeat-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyRepeatSectionComponent extends FieldArrayType {}
