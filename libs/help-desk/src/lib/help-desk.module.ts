import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormlyTaigaUiModule, GetFileModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiDropdownSelectionModule,
  TuiFilterModule,
  TuiInputDateModule,
  TuiInputFileModule,
  TuiInputModule,
  TuiRadioBlockModule,
  TuiRadioLabeledModule,
  TuiSelectModule,
  TuiSelectOptionModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateCalendarComponent } from './components/create-calendar/create-calendar.component';
import { FormlyRepeatEventCalendarComponent } from './components/formly-repeat-event-calendar/formly-repeat-event-calendar.component';
import { RepeatCalendarCustomComponent } from './components/formly-repeat-event-calendar/repeat-calendar-custom/repeat-calendar-custom.component';
import { SeatComponent } from './components/seat/seat.component';
import { HelpDeskComponent } from './help-desk.component';
import { BvCalendarComponent } from './pages/bv-calendar/bv-calendar.component';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';
import { HelpDeskService } from './services/help-desk.service';

FullCalendarModule.registerPlugins([dayGridPlugin]);

export const helpDeskRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'HELP_DESK', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: HelpDeskComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'seat-map' },
          {
            path: 'seat-map',
            component: SeatMapComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_HELP_DESK', redirectTo: '/' } },
          },
          {
            path: 'bv-calendar',
            component: BvCalendarComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'VIEW_CALENDAR', redirectTo: '/' } },
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    HelpDeskComponent,
    SeatMapComponent,
    BvCalendarComponent,
    CreateCalendarComponent,
    SeatComponent,
    FormlyRepeatEventCalendarComponent,
    RepeatCalendarCustomComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(helpDeskRoutes),
    ReactiveFormsModule,
    FormlyTaigaUiModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat-event-calendar', component: FormlyRepeatEventCalendarComponent, wrappers: ['form-field'] },
      ],
    }),
    TuiInputModule,
    DragDropModule,
    PolymorpheusModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiAvatarModule,
    TuiLetModule,
    TuiRadioBlockModule,
    FullCalendarModule,
    TuiSelectModule,
    TuiSelectOptionModule,
    TuiDropdownSelectionModule,
    TuiDataListWrapperModule,
    TuiTextAreaModule,
    TuiInputFileModule,
    TuiSvgModule,
    LayoutModule,
    TuiInputDateModule,
    TuiFilterModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiButtonModule,
    TuiCheckboxBlockModule,
    TuiGroupModule,
    TuiRadioLabeledModule,
    GetFileModule,
    TuiLoaderModule,
    TranslocoModule,
  ],
  providers: [HelpDeskService],
})
export class HelpDeskModule {}
