import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiLabelModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiMultiSelectModule } from '@taiga-ui/kit';
import { SelectOptionsModule } from '../../../pipes/select-options/select-options.module';
import { FormFieldModule } from '../form-field/form-field.module';
import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiDataListModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'multi-select', component: MultiSelectComponent, wrappers: ['form-field'] }],
    }),
    TuiMultiSelectModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    SelectOptionsModule,
  ],
})
export class MultiSelectModule {}
