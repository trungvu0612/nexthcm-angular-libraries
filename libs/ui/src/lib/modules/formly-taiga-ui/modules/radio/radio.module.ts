import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiHintControllerModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiRadioGroupModule,
  TuiRadioLabeledModule,
  TuiRadioListModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

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
    TuiSvgModule,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiInputDateModule,
    TuiInputDateModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
  ],
})
export class RadioModule {}
