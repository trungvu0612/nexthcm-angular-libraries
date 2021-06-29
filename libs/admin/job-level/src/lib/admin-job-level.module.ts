import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent, FormlyTaigaUiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { JobLevelComponent } from './job-level.component';
import { ListJobLevelComponent } from './list-job-level/list-job-level.component';
import { UpsertJobLevelComponent } from './upsert-job-level/upsert-job-level.component';

export const adminJobLevelRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: JobLevelComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'list' },
          { path: 'list', component: ListJobLevelComponent },
          { path: 'add', component: UpsertJobLevelComponent },
          { path: 'edit/:id', component: UpsertJobLevelComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [JobLevelComponent, ListJobLevelComponent, UpsertJobLevelComponent],
  imports: [
    CommonModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiTagModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminJobLevelRoutes),
    RouterModule,
  ],
})
export class AdminJobLevelModule {}
