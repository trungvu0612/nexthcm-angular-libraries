import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent, LayoutModule, PromptComponentModule } from '@nexthcm/ui';
import { OverviewComponent } from './pages/overview/overview.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, RouterModule.forChild(homeRoutes), LayoutModule, PromptComponentModule],
})
export class HomeModule {}
