import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelpDeskComponent } from './help-desk.component';
import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { ViewDetailDialogComponent } from './components/view-detail-dialog/view-detail-dialog.component';
import { AddSeatDialogComponent } from './components/add-seat-dialog/add-seat-dialog.component';
import { UiModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    HelpDeskComponent,
    SeatMapComponent,
    ViewDetailDialogComponent,
    AddSeatDialogComponent,
    RepeatSectionComponent,
  ],
  imports: [
    CommonModule,
    HelpDeskRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [{ name: 'repeat', component: RepeatSectionComponent }],
    }),
    TuiInputModule,
    TuiSvgModule,
    UiModule,
    DragDropModule,
  ],
})
export class HelpDeskModule {}
