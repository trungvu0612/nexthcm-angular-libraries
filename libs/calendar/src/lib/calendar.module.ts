import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiFilterModule, TuiSelectModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from './calendar.service';
import { CalendarRepeatDialogComponent } from './components/calendar-repeat-dialog/calendar-repeat-dialog.component';
import { CreateCalendarEventDialogComponent } from './components/create-calendar-event-dialog/create-calendar-event-dialog.component';
import { FormlyRepeatEventCalendarComponent } from './components/formly-repeat-event-calendar/formly-repeat-event-calendar.component';

FullCalendarModule.registerPlugins([dayGridPlugin]);

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_CALENDAR', redirectTo: '/' } },
    children: [{ path: '', component: CalendarComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CALENDAR_ROUTES),
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat-event-calendar', component: FormlyRepeatEventCalendarComponent, wrappers: ['form-field'] },
      ],
    }),
    TranslocoModule,
    TuiButtonModule,
    TuiFilterModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiSvgModule,
    TuiLinkModule,
    FullCalendarModule,
    LayoutModule,
  ],
  declarations: [
    CalendarComponent,
    CreateCalendarEventDialogComponent,
    CalendarRepeatDialogComponent,
    FormlyRepeatEventCalendarComponent,
  ],
  providers: [CalendarService],
})
export class CalendarModule {}
