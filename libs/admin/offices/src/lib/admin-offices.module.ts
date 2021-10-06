import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { OfficesEffects } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, InputFilterComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { UpsertOfficeDialogComponent } from './components/upsert-office-dialog/upsert-office-dialog.component';
import { OfficeManagementComponent } from './pages/office-management/office-management.component';
import { AdminOfficesService } from './services/admin-offices.service';

export const adminOfficesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OFFICE', redirectTo: '/' } },
    children: [{ path: '', component: OfficeManagementComponent }],
  },
];

@NgModule({
  declarations: [OfficeManagementComponent, UpsertOfficeDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminOfficesRoutes),
    TranslocoModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TableModule,
    TuiLetModule,
    InputFilterComponentModule,
    TuiLoaderModule,
    LayoutModule,
    NgxPermissionsModule,
    BaseFormComponentModule,
    AkitaNgEffectsModule.forFeature([OfficesEffects]),
  ],
  providers: [
    AdminOfficesService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'offices',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminOfficesModule {}
