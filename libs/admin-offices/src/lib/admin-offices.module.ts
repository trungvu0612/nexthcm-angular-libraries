import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOfficesRoutingModule } from './admin-offices-routing.module';
import { AdminOfficesComponent } from './admin-offices.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiSvgModule } from '@taiga-ui/core';
import { MainPageComponent } from './components/main-page/main-page.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { OfficeDetailDialogComponent } from './components/office-detail-dialog/office-detail-dialog.component';
import { FormlyModule } from '@ngx-formly/core';
import { InputsModule } from '@nexthcm/ui';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomDetailDialogComponent } from './components/room-detail-dialog/room-detail-dialog.component';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AdminOfficesComponent,
    MainPageComponent,
    OfficesComponent,
    OfficeDetailDialogComponent,
    RoomsComponent,
    RoomDetailDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminOfficesRoutingModule,
    TranslocoModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    FormlyModule,
    InputsModule,
    TuiInputFileModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class AdminOfficesModule {}
