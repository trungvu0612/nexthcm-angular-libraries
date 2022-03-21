import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TuiToggleModule } from '@taiga-ui/kit';

import { FormFieldModule } from '../../modules/formly-taiga-ui';

@Component({
  selector: 'hcm-formly-status-toggle',
  templateUrl: './formly-status-toggle.component.html',
  styleUrls: ['./formly-status-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyStatusToggleComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      size: 'l',
    },
  };
}

@NgModule({
  declarations: [FormlyStatusToggleComponent],
  imports: [
    CommonModule,
    TuiToggleModule,
    ReactiveFormsModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'status-toggle', component: FormlyStatusToggleComponent, wrappers: ['form-field'] }],
    }),
    TranslocoModule,
  ],
  exports: [FormlyStatusToggleComponent],
})
export class FormlyStatusToggleComponentModule {}
