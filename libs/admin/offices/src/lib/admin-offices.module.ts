import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { InputFilterComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OfficesComponent } from './pages/offices/offices.component';
import { AdminOfficesService } from './services/admin-offices.service';

export const adminOfficesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OFFICE', redirectTo: '/' } },
    children: [{ path: '', component: OfficesComponent }],
  },
];

@NgModule({
  declarations: [OfficesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminOfficesRoutes),
    TranslocoModule,
    FormlyModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiButtonModule,
    TableModule,
    TuiLetModule,
    InputFilterComponentModule,
    TuiLoaderModule,
    LayoutModule,
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
