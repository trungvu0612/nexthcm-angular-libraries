import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { TuiEditorModule } from '@taiga-ui/addon-editor';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiHintControllerModule,
  TuiLabelModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiInputCountModule,
  TuiInputDateModule,
  TuiInputDateRangeModule,
  TuiInputDateTimeModule,
  TuiInputFileModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiInputMonthModule,
  TuiInputMonthRangeModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiInputPhoneInternationalModule,
  TuiInputPhoneModule,
  TuiInputSliderModule,
  TuiInputTagModule,
  TuiInputTimeModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TextMaskModule } from 'angular2-text-mask';
import { FormFieldModule } from '../form-field/form-field.module';
import { EditorComponent } from './editor/editor.component';
import { InputCountComponent } from './input-count/input-count.component';
import { InputDateRangeComponent } from './input-date-range/input-date-range.component';
import { InputDateTimeComponent } from './input-date-time/input-date-time.component';
import { InputDateComponent } from './input-date/input-date.component';
import { InputInlineComponent } from './input-inline/input-inline.component';
import { InputMonthRangeComponent } from './input-month-range/input-month-range.component';
import { InputMonthComponent } from './input-month/input-month.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { InputPhoneInternationalComponent } from './input-phone-international/input-phone-international.component';
import { InputPhoneComponent } from './input-phone/input-phone.component';
import { InputSliderComponent } from './input-slider/input-slider.component';
import { InputTagComponent } from './input-tag/input-tag.component';
import { InputTimeComponent } from './input-time/input-time.component';
import { InputComponent } from './input/input.component';
import { TextAreaComponent } from './text-area/text-area.component';

@NgModule({
  declarations: [
    InputComponent,
    InputDateComponent,
    InputCountComponent,
    InputDateTimeComponent,
    InputNumberComponent,
    InputPasswordComponent,
    InputPhoneComponent,
    InputDateRangeComponent,
    InputTagComponent,
    InputTimeComponent,
    InputPhoneInternationalComponent,
    TextAreaComponent,
    InputMonthComponent,
    InputMonthRangeComponent,
    EditorComponent,
    InputInlineComponent,
    InputSliderComponent,
  ],
  imports: [
    CommonModule,
    TuiInputModule,
    ReactiveFormsModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [
        { name: 'input', component: InputComponent, wrappers: ['form-field'] },
        { name: 'input-date', component: InputDateComponent, wrappers: ['form-field'] },
        { name: 'input-month', component: InputMonthComponent, wrappers: ['form-field'] },
        { name: 'input-count', component: InputCountComponent, wrappers: ['form-field'] },
        { name: 'input-date-time', component: InputDateTimeComponent, wrappers: ['form-field'] },
        { name: 'input-slider', component: InputSliderComponent, wrappers: ['form-field'] },
        { name: 'input-number', component: InputNumberComponent, wrappers: ['form-field'] },
        { name: 'input-password', component: InputPasswordComponent, wrappers: ['form-field'] },
        { name: 'input-phone', component: InputPhoneComponent, wrappers: ['form-field'] },
        { name: 'input-date-range', component: InputDateRangeComponent, wrappers: ['form-field'] },
        { name: 'input-month-range', component: InputMonthRangeComponent, wrappers: ['form-field'] },
        { name: 'input-tag', component: InputTagComponent, wrappers: ['form-field'] },
        { name: 'input-time', component: InputTimeComponent, wrappers: ['form-field'] },
        { name: 'input-phone-international', component: InputPhoneInternationalComponent, wrappers: ['form-field'] },
        { name: 'text-area', component: TextAreaComponent, wrappers: ['form-field'] },
        { name: 'editor', component: EditorComponent, wrappers: ['form-field'] },
        { name: 'input-inline', component: InputInlineComponent },
      ],
    }),
    TuiTextfieldControllerModule,
    TuiHintControllerModule,
    TuiSvgModule,
    TuiErrorModule,
    TuiFieldErrorModule,
    TuiLabelModule,
    TuiInputDateModule,
    TuiInputCountModule,
    TuiInputDateTimeModule,
    TuiCurrencyPipeModule,
    TuiInputNumberModule,
    TuiInputPasswordModule,
    TuiInputPhoneModule,
    TuiInputDateRangeModule,
    TuiInputTagModule,
    TuiInputTimeModule,
    TuiTextAreaModule,
    TuiInputMonthModule,
    TuiInputMonthRangeModule,
    TuiEditorModule,
    TuiInputInlineModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    TuiInputFileModule,
    TuiInputSliderModule,
    TextMaskModule,
    TuiInputPhoneInternationalModule,
  ],
})
export class InputsModule {}
