import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { PushModule } from '@rx-angular/template';
import { TuiTagModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

import { CreateWorkFromHomeRequestComponent } from './create-work-from-home-request/create-work-from-home-request.component';
import { CreateWorkingOnsiteRequestComponent } from './create-working-onsite-request/create-working-onsite-request.component';

@NgModule({
  declarations: [CreateWorkFromHomeRequestComponent, CreateWorkingOnsiteRequestComponent],
  imports: [CommonModule, BaseFormComponentModule, PushModule, TuiTagModule, PolymorpheusModule],
})
export class CreateRequestFormsModule {}
