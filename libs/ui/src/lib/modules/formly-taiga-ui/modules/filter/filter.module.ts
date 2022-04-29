import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiFilterModule } from '@taiga-ui/kit';

import { FormFieldModule } from '../form-field/form-field.module';
import { FilterComponent } from './filter.component';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    TuiFilterModule,
    ReactiveFormsModule,
    SelectOptionsModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'filter', component: FilterComponent, wrappers: ['form-field'] }],
    }),
    PushModule,
    TuiLoaderModule,
    TuiLetModule,
  ],
})
export class FilterModule {}
