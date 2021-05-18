import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTooltipModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { SelectSearchComponent } from './select-search.component';

@NgModule({
  declarations: [SelectSearchComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [{ name: 'select-search', component: SelectSearchComponent, wrappers: ['form-field'] }],
    }),
    TuiTooltipModule,
    PolymorpheusModule,
    TuiAvatarModule,
  ],
})
export class SelectSearchModule {}
