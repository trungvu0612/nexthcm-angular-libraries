import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { TuiFilterModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { SelectOptionsModule } from '../../../pipes/select-options/select-options.module';

@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    TuiFilterModule,
    ReactiveFormsModule,
    TuiLetModule,
    SelectOptionsModule,
    FormlyModule.forChild({ types: [{ name: 'filter', component: FilterComponent }] }),
  ],
})
export class FilterModule {}
