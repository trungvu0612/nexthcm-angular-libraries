import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { LeaveTypeComponent } from './leave-type.component';
import { ListLeaveTypeComponent } from './list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './upsert-leave-type/upsert-leave-type.component';

@NgModule({
  declarations: [LeaveTypeComponent, ListLeaveTypeComponent, UpsertLeaveTypeComponent],
  imports: [
    CommonModule,
    RouterModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiTagModule,
    TuiInputModule,
    TuiTextAreaModule,
    TuiErrorModule,
    TuiFieldErrorModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
  ],
})
export class LeaveTypeModule {}
