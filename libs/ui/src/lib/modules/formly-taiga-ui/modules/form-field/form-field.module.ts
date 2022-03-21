import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiErrorModule, TuiLabelModule } from '@taiga-ui/core';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

import { FormFieldComponent } from './form-field.component';

@NgModule({
  declarations: [FormFieldComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiLabelModule,
    PolymorpheusModule,
    FormlyModule.forChild({ wrappers: [{ name: 'form-field', component: FormFieldComponent }] }),
    TuiErrorModule,
  ],
})
export class FormFieldModule {}
