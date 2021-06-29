import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetFileModule, LayoutModule } from '@nexthcm/ui';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputMonthModule } from '@taiga-ui/kit';
import { UpdatedDetailComponent } from './components/updated-detail/updated-detail.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

@NgModule({
  declarations: [PolicyComponent, PoliciesComponent, PolicyDetailComponent, UpdatedComponent, UpdatedDetailComponent],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    LayoutModule,
    GetFileModule,
    TuiSvgModule,
    TuiInputMonthModule,
    ReactiveFormsModule,
    TuiAvatarModule,
    TuiScrollbarModule
  ],
})
export class PolicyModule {}
