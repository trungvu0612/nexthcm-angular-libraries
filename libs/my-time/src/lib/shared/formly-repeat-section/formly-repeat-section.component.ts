import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'hcm-formly-repeat-section',
  templateUrl: './formly-repeat-section.component.html',
  styleUrls: ['./formly-repeat-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyRepeatSectionComponent extends FieldArrayType {}

@NgModule({
  declarations: [FormlyRepeatSectionComponent],
  imports: [CommonModule, FormlyModule, TuiButtonModule],
  exports: [FormlyRepeatSectionComponent],
})
export class FormlyRepeatSectionComponentModule {}
