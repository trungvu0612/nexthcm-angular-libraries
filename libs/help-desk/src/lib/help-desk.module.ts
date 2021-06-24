import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormlyTaigaUiModule, GetFileModule, LayoutModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
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
import { AddSeatDialogComponent } from './components/add-seat-dialog/add-seat-dialog.component';
import { CreateCalendarComponent } from './components/create-calendar/create-calendar.component';
import { FormlyRepeatEventCalendarComponent } from './components/formly-repeat-event-calendar/formly-repeat-event-calendar.component';
import { RepeatCalendarCustomComponent } from './components/formly-repeat-event-calendar/repeat-calendar-custom/repeat-calendar-custom.component';
import { SeatComponent } from './components/seat/seat.component';
import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { HelpDeskComponent } from './help-desk.component';
import { BvCalendarComponent } from './pages/bv-calendar/bv-calendar.component';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';
import { HelpDeskService } from './services/help-desk.service';

FullCalendarModule.registerPlugins([dayGridPlugin]);

@NgModule({
  declarations: [
    HelpDeskComponent,
    SeatMapComponent,
    AddSeatDialogComponent,
    BvCalendarComponent,
    CreateCalendarComponent,
    SeatComponent,
    FormlyRepeatEventCalendarComponent,
    RepeatCalendarCustomComponent,
  ],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
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
    TuiTextfieldControllerModule,
    TuiDataListModule,
    FormlyModule,
    GetFileModule,
  ],
  providers: [HelpDeskService],
})
export class HelpDeskModule {}
