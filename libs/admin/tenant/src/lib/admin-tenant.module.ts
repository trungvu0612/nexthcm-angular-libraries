import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetStatusPipeModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { UpsertTenantComponent } from './pages/upsert-tenant/upsert-tenant.component';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { AdminTenantRoutingModule } from './admin-tenant-routing.module';
import { AdminTenantComponent } from './admin-tenant.component';
import { AdminTenantService } from './services/admin-tenant.service';
import { OrganizationalStructureComponent } from './pages/organizational-structure/organizational-structure.component';
import { TableModule } from 'ngx-easy-table';
import { OrganizationalChartComponent } from './pages/organizational-chart/organizational-chart.component';
import { TuiLetModule } from '@taiga-ui/cdk';
import { HeroIconModule, pencilAlt, trash } from 'ng-heroicon';

@NgModule({
  declarations: [
    TenantListComponent,
    AdminTenantComponent,
    UpsertTenantComponent,
    DomainListComponent,
    OrganizationalStructureComponent,
    OrganizationalChartComponent,
  ],
  imports: [
    CommonModule,
    AdminTenantRoutingModule,
    ReactiveFormsModule,
    FormlyModule,
    TranslocoModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiInputModule,
    TuiSvgModule,
    GetStatusPipeModule,
    TuiTagModule,
    TuiTextfieldControllerModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiAvatarModule,
    TableModule,
    TuiScrollbarModule,
    TuiLetModule,
    HeroIconModule.withIcons({ pencilAlt, trash }),
  ],
  providers: [AdminTenantService],
})
export class AdminTenantModule {}
