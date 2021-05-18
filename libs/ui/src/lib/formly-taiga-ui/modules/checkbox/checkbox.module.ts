import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiHintControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiCheckboxModule } from '@taiga-ui/kit';
import { FormFieldModule } from '../form-field/form-field.module';
import { CheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    TuiHintControllerModule,
    FormFieldModule,
    FormlyModule.forChild({ types: [{ name: 'checkbox', component: CheckboxComponent, wrappers: ['form-field'] }] }),
    ReactiveFormsModule,
  ],
})
export class CheckboxModule {}
