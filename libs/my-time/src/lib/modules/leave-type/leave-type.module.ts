import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveTypeComponent } from './leave-type.component';
import {RouterModule} from "@angular/router";
import { ListLeaveTypeComponent } from './pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './pages/upsert-leave-type/upsert-leave-type.component';
import {TuiTableModule} from "@taiga-ui/addon-table";
import {TuiMarkerIconModule, TuiPaginationModule, TuiTagModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiButtonShape} from "@taiga-ui/core";



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
    TuiMarkerIconModule
  ]
})
export class LeaveTypeModule { }
