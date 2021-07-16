import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatMapListComponent } from './pages/seat-map-list/seat-map-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { SeatMapsComponent } from './admin-seat-maps.component';
import { AdminTenantRoutingModule } from './admin-seat-maps-routing.module';
import { TableModule } from 'ngx-easy-table';
import { HeroIconModule, pencilAlt, trash } from 'ng-heroicon';
import { UpsertSeatMapComponent } from './pages/seat-map-dialog/upsert-seat-map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GetFileModule, PromptComponentModule } from '@nexthcm/ui';
import { AdminSeatMapsService } from './services/admin-seat-maps.service';

@NgModule({
  declarations: [SeatMapsComponent, SeatMapListComponent, UpsertSeatMapComponent],
  imports: [
    CommonModule,
    AdminTenantRoutingModule,
    TranslocoModule,
    TuiButtonModule,
    TableModule,
    HeroIconModule.withIcons({ pencilAlt, trash }),
    ReactiveFormsModule,
    FormlyModule,
    TuiInputFileModule,
    DragDropModule,
    TuiSvgModule,
    GetFileModule,
    PromptComponentModule,
  ],
  providers: [AdminSeatMapsService],
})
export class AdminSeatMapsModule {}
