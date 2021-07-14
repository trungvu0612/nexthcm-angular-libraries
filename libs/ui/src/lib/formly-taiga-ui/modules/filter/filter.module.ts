import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiFilterModule } from '@taiga-ui/kit';
import { SelectOptionsModule } from '../../../pipes/';
import { FilterComponent } from './filter.component';

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
