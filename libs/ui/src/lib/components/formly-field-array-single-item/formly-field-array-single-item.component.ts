import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-field-array-single-item',
  templateUrl: './formly-field-array-single-item.component.html',
  styleUrls: ['./formly-field-array-single-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldArraySingleItemComponent extends FieldArrayType {}

@NgModule({
  declarations: [FormlyFieldArraySingleItemComponent],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      types: [{ name: 'field-array-single-item', component: FormlyFieldArraySingleItemComponent }],
    }),
  ],
})
export class FormlyFieldArraySingleItemComponentModule {}
