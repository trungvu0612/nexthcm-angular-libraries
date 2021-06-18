import { NgModule } from '@angular/core';
import { CheckboxModule } from './modules/checkbox/checkbox.module';
import { ComboBoxModule } from './modules/combo-box/combo-box.module';
import { FilesModule } from './modules/files/files.module';
import { FormFieldModule } from './modules/form-field/form-field.module';
import { InputsModule } from './modules/inputs/inputs.module';
import { RadioModule } from './modules/radio/radio.module';
import { SelectsModule } from './modules/selects/selects.module';
import { ToggleModule } from './modules/toggle/toggle.module';
import { FilterModule } from './modules/filter/filter.module';

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
  ],
})
export class FormlyTaigaUiModule {}
