import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiElementModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiHintControllerModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiMultiSelectModule, TuiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { FormFieldModule } from '../form-field/form-field.module';
import { MultiSelectSearchComponent } from './multi-select-search/multi-select-search.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [SelectComponent, MultiSelectComponent, MultiSelectSearchComponent],
  imports: [
    CommonModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [
        { name: 'select', component: SelectComponent, wrappers: ['form-field'] },
        { name: 'multi-select', component: MultiSelectComponent, wrappers: ['form-field'] },
        { name: 'multi-select-search', component: MultiSelectSearchComponent, wrappers: ['form-field'] },
      ],
    }),
    TuiMultiSelectModule,
    TuiLetModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    SelectOptionsModule,
    PushModule,
    TuiDataListModule,
    TuiElementModule,
    PolymorpheusModule,
    TuiLoaderModule,
    TuiSelectModule,
    TuiHintControllerModule,
  ],
})
export class SelectsModule {}
