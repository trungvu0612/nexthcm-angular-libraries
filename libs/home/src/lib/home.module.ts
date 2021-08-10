import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TranslocoRootModule } from 'libs/core/src/lib/transloco/transloco-root.module';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OverviewComponent } from './pages/overview/overview.component';
import { SecondsToHourMinutePipeModule } from 'libs/my-time/src/lib/pipes/seconds-to-hour-minute/seconds-to-hour-minute.pipe'
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
  imports: [CommonModule, RouterModule.forChild(HOME_ROUTES), LayoutModule, TranslocoRootModule, TranslocoLocaleModule, SecondsToHourMinutePipeModule],
})
export class HomeModule {}
