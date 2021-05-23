import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@nexthcm/ui';
import { PolicyLayoutComponent } from './policy-layout.component';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './pages/policy/policy.component';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { TuiSvgModule } from '@taiga-ui/core';
import { UpdatedComponent } from './pages/updated/updated.component';
import { TuiAvatarModule, TuiInputMonthModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdatedDetailComponent } from './components/updated-detail/updated-detail.component';

@NgModule({
  declarations: [
    PolicyLayoutComponent,
    PolicyComponent,
    PolicyDetailComponent,
    UpdatedComponent,
    UpdatedDetailComponent,
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    LayoutModule,
    TuiSvgModule,
    TuiInputMonthModule,
    ReactiveFormsModule,
    TuiAvatarModule,
  ],
})
export class PolicyModule {}
