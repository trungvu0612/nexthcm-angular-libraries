import { NgModule } from '@angular/core';
import { CheckboxModule } from './modules/checkbox/checkbox.module';
import { ComboBoxModule } from './modules/combo-box/combo-box.module';
import { FilesModule } from './modules/files/files.module';
import { InputsModule } from './modules/inputs/inputs.module';
import { MultiSelectModule } from './modules/multi-select/multi-select.module';
import { RadioModule } from './modules/radio/radio.module';
import { SelectModule } from './modules/select/select.module';
import { ToggleModule } from './modules/toggle/toggle.module';

@NgModule({
  imports: [
    InputsModule,
    CheckboxModule,
    SelectModule,
    RadioModule,
    MultiSelectModule,
    ToggleModule,
    FilesModule,
    ComboBoxModule,
  ],
})
export class FormlyTaigaUiModule {}
