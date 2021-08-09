import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { ContractListComponent } from './pages/contract-list/contract-list.component';
import { UpsertContractComponent } from './pages/upsert-contract/upsert-contract.component';

export const adminContractsRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ContractListComponent },
      { path: 'add', component: UpsertContractComponent },
      { path: ':contractId/edit', component: UpsertContractComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminContractsRoutes),
    TableModule,
    TranslocoModule,
    TuiSvgModule,
    TuiButtonModule,
    FormlyModule,
    ReactiveFormsModule,
  ],
  declarations: [ContractListComponent, UpsertContractComponent],
})
export class AdminContractsModule {}
