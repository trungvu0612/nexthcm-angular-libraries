import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiHintControllerModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiRadioGroupModule, TuiRadioLabeledModule, TuiRadioListModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { SelectOptionsModule } from '../../shared/select-options/select-options.module';
import { FormFieldModule } from '../form-field/form-field.module';
import { RadioComponent } from './radio.component';

@NgModule({
  declarations: [RadioComponent],
  imports: [
    CommonModule,
    TuiHintControllerModule,
    FormFieldModule,
    FormlyModule.forChild({ types: [{ name: 'radio', component: RadioComponent, wrappers: ['form-field'] }] }),
    TuiRadioListModule,
    ReactiveFormsModule,
    PolymorpheusModule,
    SelectOptionsModule,
    TuiLabelModule,
    TuiRadioGroupModule,
    TuiLetModule,
    TuiRadioLabeledModule,
  ],
})
export class RadioModule {}
