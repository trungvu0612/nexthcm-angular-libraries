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
import { TuiSelectModule } from '@taiga-ui/kit';
import { SelectOptionsModule } from '../../../pipes/select-options/select-options.module';
import { FormFieldModule } from '../form-field/form-field.module';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [SelectComponent],
  imports: [
    CommonModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiDataListModule,
    FormFieldModule,
    FormlyModule.forChild({ types: [{ name: 'select', component: SelectComponent, wrappers: ['form-field'] }] }),
    TuiTextfieldControllerModule,
    TuiLetModule,
    TuiLoaderModule,
    TuiLabelModule,
    SelectOptionsModule,
    TuiHintControllerModule,
  ],
})
export class SelectModule {}
