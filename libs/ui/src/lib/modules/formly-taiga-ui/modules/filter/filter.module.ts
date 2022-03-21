import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiFilterModule } from '@taiga-ui/kit';

import { FormFieldLabelOutsideComponentModule } from '../form-field-label-outside/form-field-label-outside.component';
import { FilterComponent } from './filter.component';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    TuiFilterModule,
    ReactiveFormsModule,
    SelectOptionsModule,
    FormFieldLabelOutsideComponentModule,
    FormlyModule.forChild({
      types: [{ name: 'filter', component: FilterComponent, wrappers: ['form-field-label-outside'] }],
    }),
    PushModule,
  ],
})
export class FilterModule {}
