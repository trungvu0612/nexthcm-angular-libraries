import { NgModule } from '@angular/core';
import { CheckboxLabeledComponentModule } from './modules/checkbox-labeled/checkbox-labeled.component';
import { CheckboxModule } from './modules/checkbox/checkbox.module';
import { ComboBoxModule } from './modules/combo-box/combo-box.module';
import { FilesModule } from './modules/files/files.module';
import { FilterModule } from './modules/filter/filter.module';
import { FormFieldModule } from './modules/form-field/form-field.module';
import { InputsModule } from './modules/inputs/inputs.module';
import { RadioModule } from './modules/radio/radio.module';
import { SelectsModule } from './modules/selects/selects.module';
import { StepperComponentModule } from './modules/stepper/stepper.component';
import { ToggleModule } from './modules/toggle/toggle.module';

@NgModule({
  imports: [
    FormFieldModule,
    InputsModule,
    CheckboxModule,
    SelectsModule,
    RadioModule,
    ToggleModule,
    FilesModule,
    ComboBoxModule,
    FilterModule,
    CheckboxLabeledComponentModule,
    StepperComponentModule,
  ],
})
export class FormlyTaigaUiModule {}
