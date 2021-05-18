import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
