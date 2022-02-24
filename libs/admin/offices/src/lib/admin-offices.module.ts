import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { OfficesEffects } from '@nexthcm/cdk';
import {
  BaseFormComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  LeafletMapModule,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { UpsertOfficeDialogComponent } from './components/upsert-office-dialog/upsert-office-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { OfficeManagementComponent } from './pages/office-management/office-management.component';
import { AdminOfficesService } from './services/admin-offices.service';
import { TRANSLATION_SCOPE } from './translation-scope';

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
    TuiPrimitiveCheckboxModule,
    LeafletMapModule,
  ],
  providers: [
    AdminOfficesService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminOfficesModule {}
