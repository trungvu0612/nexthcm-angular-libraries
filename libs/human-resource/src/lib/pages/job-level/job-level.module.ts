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
import { JobLevelComponent } from './job-level.component';
import { ListJobLevelComponent } from './list-job-level/list-job-level.component';
import { UpsertJobLevelComponent } from './upsert-job-level/upsert-job-level.component';

@NgModule({
  declarations: [JobLevelComponent, ListJobLevelComponent, UpsertJobLevelComponent],
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
    ReactiveFormsModule
  ],
})
export class JobLevelModule {}
