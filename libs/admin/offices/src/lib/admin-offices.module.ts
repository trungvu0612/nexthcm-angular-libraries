import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { OfficeDetailDialogComponent } from './components/office-detail-dialog/office-detail-dialog.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { AdminOfficesService } from './services/admin-offices.service';
import { TableModule } from 'ngx-easy-table';
import { LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { TuiLetModule } from '@taiga-ui/cdk';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: OfficesComponent }],
  },
];

@NgModule({
  declarations: [OfficesComponent, OfficeDetailDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslocoModule,
    FormlyModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiButtonModule,
    TableModule,
    PromptComponentModule,
    TuiLetModule,
  ],
  providers: [AdminOfficesService],
})
export class AdminOfficesModule {}
