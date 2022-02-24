import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLabelModule } from '@taiga-ui/core';
import { TuiToggleModule } from '@taiga-ui/kit';

import { FormFieldModule } from '../form-field/form-field.module';
import { ToggleComponent } from './toggle.component';

@NgModule({
  declarations: [ToggleComponent],
  imports: [
    CommonModule,
    FormFieldModule,
    FormlyModule.forChild({ types: [{ name: 'toggle', component: ToggleComponent, wrappers: ['form-field'] }] }),
    ReactiveFormsModule,
    TuiToggleModule,
    TuiLabelModule,
  ],
})
export class ToggleModule {}
