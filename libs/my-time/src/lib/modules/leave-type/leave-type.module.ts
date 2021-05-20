import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveTypeComponent } from './leave-type.component';
import {RouterModule} from "@angular/router";
import { ListLeaveTypeComponent } from './pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './pages/upsert-leave-type/upsert-leave-type.component';
import {TuiTableModule} from "@taiga-ui/addon-table";
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiMarkerIconModule,
  TuiPaginationModule,
  TuiTagModule
} from "@taiga-ui/kit";
import {
  TuiButtonModule,
  TuiButtonShape,
  TuiErrorModule,
  TuiPrimitiveTextfieldModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {ReactiveFormsModule} from "@angular/forms";
import {FormModule} from "@nexthm/form";



@NgModule({
  declarations: [
    LeaveTypeComponent,
    ListLeaveTypeComponent,
    UpsertLeaveTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TuiTableModule,
    TuiPaginationModule,
    TuiButtonModule,
    TuiTagModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorModule,
    TuiMarkerIconModule,
    FormModule,
    ReactiveFormsModule
  ]
})
export class LeaveTypeModule { }
