import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiHintControllerModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiComboBoxModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { FormFieldModule } from '../form-field/form-field.module';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { InputObjectComponent } from './input-object/input-object.type';

@NgModule({
  declarations: [ComboBoxComponent, InputObjectComponent],
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
      types: [
        { name: 'combo-box', component: ComboBoxComponent, wrappers: ['form-field'] },
        {
          name: 'input-object',
          component: InputObjectComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
    PolymorpheusModule,
    FormFieldModule,
  ],
  exports: [ComboBoxComponent],
})
export class ComboBoxModule {}
