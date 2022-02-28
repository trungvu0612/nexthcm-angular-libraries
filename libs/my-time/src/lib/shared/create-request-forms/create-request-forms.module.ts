import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

import { CreateWorkFromHomeRequestComponent } from './create-work-from-home-request/create-work-from-home-request.component';
import { CreateWorkingOnsiteRequestComponent } from './create-working-onsite-request/create-working-onsite-request.component';
import { FormlyRepeatSectionComponent } from './formly-repeat-section/formly-repeat-section.component';

@NgModule({
  declarations: [FormlyRepeatSectionComponent, CreateWorkFromHomeRequestComponent, CreateWorkingOnsiteRequestComponent],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      types: [{ name: 'repeat', component: FormlyRepeatSectionComponent }],
    }),
    TuiButtonModule,
    BaseFormComponentModule,
    TranslocoModule,
    PushModule,
    TuiTagModule,
    PolymorpheusModule,
  ],
})
export class CreateRequestFormsModule {}
