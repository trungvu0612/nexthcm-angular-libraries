import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-tenant-profile',
  templateUrl: './tenant-profile.component.html',
  styleUrls: ['./tenant-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TenantProfileComponent {
  private readonly request$ = this.adminTenantsService
    .getTenant(this.activatedRoute.snapshot.params.tenantId)
    .pipe(startWith(null), shareReplay(1));
  readonly loading$ = this.request$.pipe(map((value) => !value), catchError(() => of(false)));
  readonly profile$ = this.request$.pipe(filter(isPresent));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onSubmit(payload: Tenant): void {
    this.adminTenantsService
      .updateTenant(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.promptService.handleResponse('updateTenantSuccessfully'));
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
