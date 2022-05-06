import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { from, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { Policy } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent extends AbstractServerSortPaginationTableComponent<Policy> {
  readonly columns$ = this.translocoService
    .selectTranslateObject('PERMISSION_TABLE', {}, this.translocoScope.scope)
    .pipe(
      map((translate) => [
        { key: 'name', title: translate.name },
        { key: 'code', title: translate.code },
        { key: 'description', title: translate.description },
        { key: 'action', title: translate.action, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminPermissionsService.getPermissions(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<Policy>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private adminPermissionsService: AdminPermissionsService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService
  ) {
    super(state, activatedRoute);
    this.state.connect(this.request$.pipe(filter(isPresent)));
  }

  delete(id: string) {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(this.translocoScope.scope + '.deletePermission'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminPermissionsService.deletePermission(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(this.translocoScope.scope + '.deletePermissionSuccessfully', () =>
          this.fetch$.next()
        )
      );
  }
}
