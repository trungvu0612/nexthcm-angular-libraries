import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';

import { Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-upsert-tenant-dialog',
  templateUrl: './upsert-tenant-dialog.component.html',
  styleUrls: ['./upsert-tenant-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertTenantDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Tenant>,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(value: Tenant): void {
    this.adminTenantsService
      .createTenant(value)
      .pipe(
        tap((data) => this.context.completeWith(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(this.promptService.handleResponse(''));
  }
}
