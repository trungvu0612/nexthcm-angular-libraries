import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiOrientation } from '@taiga-ui/core';

@Component({
  selector: 'formly-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends FieldType {
  repeatItems = ['1','2',];
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      size: 'l',
      orientation: TuiOrientation.Vertical,
      readonly: false,
      textfieldLabelOutside: true,
      labelProp: 'label',
    },
  };
  repeatOnDate: any;
  afterRepeat: any;

}
