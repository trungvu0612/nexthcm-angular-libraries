import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent, LayoutModule, PromptComponentModule } from '@nexthcm/ui';
import { OverviewComponent } from './pages/overview/overview.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TranslocoModule } from '@ngneat/transloco';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OVERVIEW', redirectTo: '/' } },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
    ],
  },
];

@NgModule({
  declarations: [OverviewComponent],
  imports: [CommonModule, RouterModule.forChild(HOME_ROUTES), LayoutModule, PromptComponentModule, TranslocoModule],
})
export class HomeModule {}
