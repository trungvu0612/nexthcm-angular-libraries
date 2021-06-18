import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-select',
  templateUrl: './object-select.component.html',
  styleUrls: ['./object-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectSelectComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      trackByFn: (item: any) => item.id,
      labelProp: 'label',
      valueProp: '',
      imageProp: 'image',
      useOptionTemplate: false,
      useLabelTemplate: false,
      textfieldLabelOutside: true,
      searchable: false,
    },
  };

  context!: { $implicit: any };
}
