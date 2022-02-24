import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiElementModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiHintControllerModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiComboBoxModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

import { FormFieldModule } from '../form-field/form-field.module';
import { ComboBoxComponent } from './combo-box.component';

@NgModule({
  declarations: [ComboBoxComponent],
  imports: [
    CommonModule,
    TuiComboBoxModule,
    TuiLetModule,
    ReactiveFormsModule,
    TuiHintControllerModule,
    TuiTextfieldControllerModule,
    TuiAvatarModule,
    TuiDataListModule,
    TuiLoaderModule,
    TuiLabelModule,
    FormlyModule.forChild({
      types: [{ name: 'combo-box', component: ComboBoxComponent, wrappers: ['form-field'] }],
    }),
    PolymorpheusModule,
    FormFieldModule,
    TuiElementModule,
    TuiMultiSelectModule,
  ],
})
export class ComboBoxModule {}
