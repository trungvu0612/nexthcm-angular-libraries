import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { AdminOfficesRoutingModule } from './admin-offices-routing.module';
import { AdminOfficesComponent } from './admin-offices.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { OfficeDetailDialogComponent } from './components/office-detail-dialog/office-detail-dialog.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { AdminOfficesService } from './services/admin-offices.service';

@NgModule({
  declarations: [AdminOfficesComponent, MainPageComponent, OfficesComponent, OfficeDetailDialogComponent],
  imports: [
    CommonModule,
    AdminOfficesRoutingModule,
    TranslocoModule,
    FormlyModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
  ],
  providers: [AdminOfficesService],
})
export class AdminOfficesModule {}
