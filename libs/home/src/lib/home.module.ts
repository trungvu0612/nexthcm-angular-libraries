import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';
import { UiModule } from '@nexthcm/ui';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, HomeRoutingModule, UiModule],
})
export class HomeModule {}
