import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { GetFilePipeModule, UserProfileEffects } from '@nexthcm/cdk';
import { MyTimeService } from '@nexthcm/my-time';
import { AvatarComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputCopyModule, TuiIslandModule, TuiTabsModule } from '@taiga-ui/kit';
import { academicCap, HeroIconModule, identification } from 'ng-heroicon';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PersonalAccessTokenComponent } from './components/personal-access-token/personal-access-token.component';
import { ProfileDurationComponent } from './components/profile-duration/profile-duration.component';
import { ProfileEducationComponent } from './components/profile-education/profile-education.component';
import { ProfileIndividualComponent } from './components/profile-individual/profile-individual.component';
import { ProfileShuiComponent } from './components/profile-shui/profile-shui.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { homeIcons } from './shared/icons/home';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OVERVIEW', redirectTo: '/login' } },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: HomeComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          { path: '', redirectTo: 'individual', pathMatch: 'full' },
          { path: 'individual', component: ProfileIndividualComponent },
          { path: 'duration', component: ProfileDurationComponent },
          { path: 'education', component: ProfileEducationComponent },
          { path: 'shui', component: ProfileShuiComponent },
          { path: 'access-token', component: PersonalAccessTokenComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ProfileIndividualComponent,
    ProfileDurationComponent,
    ProfileEducationComponent,
    ProfileShuiComponent,
    PersonalAccessTokenComponent,
  ],
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
    GetFilePipeModule,
    AvatarComponentModule,
    TuiTabsModule,
    TuiSvgModule,
    HeroIconModule.withIcons({ academicCap, identification }),
    TuiLetModule,
    TuiIslandModule,
    AkitaNgEffectsModule.forFeature([UserProfileEffects]),
    TuiInputCopyModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiLabelModule,
    PushModule,
  ],
  providers: [MyTimeService],
})
export class HomeModule {}
