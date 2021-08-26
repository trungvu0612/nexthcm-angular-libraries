import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { WorkingHoursService } from '@nexthcm/my-time';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule } from '@rx-angular/template';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule, TuiModeModule } from '@taiga-ui/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { HomeComponent } from './home.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { homeIcons } from './shared/icons/home';

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
  declarations: [OverviewComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    LayoutModule,
    TranslocoLocaleModule,
    TranslocoModule,
    EmojiModule,
    LetModule,
    TuiLoaderModule,
    TuiLinkModule,
    TuiModeModule,
    SvgIconsModule.forChild(homeIcons),
    TuiButtonModule,
  ],
  providers: [WorkingHoursService],
})
export class HomeModule {}
