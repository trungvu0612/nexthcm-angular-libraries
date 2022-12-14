import { NgModule } from '@angular/core';

import { CheckboxModule } from './modules/checkbox/checkbox.module';
import { CheckboxLabeledComponentModule } from './modules/checkbox-labeled/checkbox-labeled.component';
import { ComboBoxModule } from './modules/combo-box/combo-box.module';
import { FilesModule } from './modules/files/files.module';
import { FilterModule } from './modules/filter/filter.module';
import { FormFieldModule } from './modules/form-field/form-field.module';
import { InputsModule } from './modules/inputs/inputs.module';
import { RepeatModule } from './modules/repeat/repeat.component';
import { SelectsModule } from './modules/selects/selects.module';
import { StepperComponentModule } from './modules/stepper/stepper.component';
import { ToggleModule } from './modules/toggle/toggle.module';

@NgModule({
  imports: [
    FormFieldModule,
    InputsModule,
    CheckboxModule,
    SelectsModule,
    ToggleModule,
    FilesModule,
    ComboBoxModule,
    FilterModule,
    CheckboxLabeledComponentModule,
    StepperComponentModule,
    RepeatModule,
  ],
})
export class FormlyTaigaUiModule {}
