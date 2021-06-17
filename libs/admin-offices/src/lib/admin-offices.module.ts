import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetFileModule, InputsModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { AdminOfficesRoutingModule } from './admin-offices-routing.module';
import { AdminOfficesComponent } from './admin-offices.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { OfficeDetailDialogComponent } from './components/office-detail-dialog/office-detail-dialog.component';
import { RoomDetailDialogComponent } from './components/room-detail-dialog/room-detail-dialog.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

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
    GetFileModule,
    TuiLetModule,
  ],
})
export class AdminOfficesModule {}
