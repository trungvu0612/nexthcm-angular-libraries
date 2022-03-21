import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-input-slider',
  templateUrl: './input-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSliderComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      label: '',
      maxLabel: '',
      minLabel: '',
      quantum: 1,
      secondary: '',
      size: 'l',
    },
  };
}
