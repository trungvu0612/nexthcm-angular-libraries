import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-checkbox-labeled',
  templateUrl: './checkbox-labeled.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxLabeledComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      size: 'm',
    },
  };
}

@NgModule({
  declarations: [CheckboxLabeledComponent],
  imports: [
    CommonModule,
    TuiCheckboxLabeledModule,
    ReactiveFormsModule,
    FormlyModule.forChild({ types: [{ name: 'checkbox-labeled', component: CheckboxLabeledComponent }] }),
  ],
  exports: [CheckboxLabeledComponent],
})
export class CheckboxLabeledComponentModule {}
