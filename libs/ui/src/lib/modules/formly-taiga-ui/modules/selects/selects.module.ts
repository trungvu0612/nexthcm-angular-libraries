import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiHintControllerModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiMultiSelectModule, TuiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { SelectOptionsModule } from '../../../../../../../cdk/src/lib/pipes';
import { FormFieldModule } from '../form-field/form-field.module';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { SelectSearchComponent } from './select-search/select-search.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [SelectComponent, MultiSelectComponent, SelectSearchComponent],
  imports: [
    CommonModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [
        { name: 'select', component: SelectComponent, wrappers: ['form-field'] },
        { name: 'multi-select', component: MultiSelectComponent, wrappers: ['form-field'] },
        { name: 'select-search', component: SelectSearchComponent, wrappers: ['form-field'] },
      ],
    }),
    TuiSelectModule,
    SelectOptionsModule,
    TuiLetModule,
    ReactiveFormsModule,
    TuiHintControllerModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiLoaderModule,
    NgSelectModule,
    TuiTooltipModule,
    PolymorpheusModule,
    TuiAvatarModule,
    TuiMultiSelectModule,
  ],
})
export class SelectsModule {}
