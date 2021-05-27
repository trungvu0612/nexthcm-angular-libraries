import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@nexthcm/ui';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputMonthModule } from '@taiga-ui/kit';
import { SwiperModule } from 'swiper/angular';
import { UpdatedDetailComponent } from './components/updated-detail/updated-detail.component';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { PolicyLayoutComponent } from './policy-layout.component';
import { PolicyRoutingModule } from './policy-routing.module';

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
    SwiperModule,
  ],
})
export class PolicyModule {}
