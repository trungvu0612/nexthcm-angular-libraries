import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiComboBoxModule, TuiInputModule, TuiRadioBlockModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { AddSeatComboBoxComponent } from './components/add-seat-combo-box/add-seat-combo-box.component';
import { AddSeatDialogComponent } from './components/add-seat-dialog/add-seat-dialog.component';
import { CreateSeatMapComponent } from './components/create-seat-map/create-seat-map.component';
import { CustomTuiComboBoxModule } from './components/custom-combo-box/custom-combo-box.module';
import { MoveSeatDialogComponent } from './components/move-seat-dialog/move-seat-dialog.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { ViewDetailDialogComponent } from './components/view-detail-dialog/view-detail-dialog.component';
import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { HelpDeskComponent } from './help-desk.component';
import { BvCalendarComponent } from './pages/bv-calendar/bv-calendar.component';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';

@NgModule({
  declarations: [
    HelpDeskComponent,
    SeatMapComponent,
    ViewDetailDialogComponent,
    AddSeatDialogComponent,
    RepeatSectionComponent,
    MoveSeatDialogComponent,
    AddSeatComboBoxComponent,
    CreateSeatMapComponent,
    BvCalendarComponent,
  ],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat', component: RepeatSectionComponent },
        {
          name: 'custom-combo-box',
          component: AddSeatComboBoxComponent,
        },
      ],
    }),
    TuiInputModule,
    TuiSvgModule,
    DragDropModule,
    PolymorpheusModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiComboBoxModule,
    CustomTuiComboBoxModule,
    TuiAvatarModule,
    TuiLetModule,
    TuiRadioBlockModule,
    FullCalendarModule,
  ],
})
export class HelpDeskModule {}
