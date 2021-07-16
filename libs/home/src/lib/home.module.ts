import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule, PromptComponentModule } from '@nexthcm/ui';
import { HomeRoutingModule } from './home-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, HomeRoutingModule, LayoutModule, PromptComponentModule],
})
export class HomeModule {}
