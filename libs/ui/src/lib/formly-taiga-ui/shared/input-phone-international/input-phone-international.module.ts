import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListModule,
  TuiGroupModule,
  TuiHintControllerModule,
  TuiHostedDropdownModule,
  TuiPrimitiveTextfieldModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputPhoneModule } from '@taiga-ui/kit';
import { InputPhoneInternationalComponent } from './input-phone-international.component';

@NgModule({
  declarations: [InputPhoneInternationalComponent],
  imports: [
    CommonModule,
    TuiHostedDropdownModule,
    TuiGroupModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldControllerModule,
    TuiInputPhoneModule,
    TuiHintControllerModule,
    ReactiveFormsModule,
    TuiDataListModule,
  ],
  exports: [InputPhoneInternationalComponent],
})
export class InputPhoneInternationalModule {}
