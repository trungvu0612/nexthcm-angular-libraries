import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { from, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Policy } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent extends AbstractServerSortPaginationTableComponent<Policy> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService.selectTranslateObject('PERMISSION_TABLE', {}, TRANSLATION_SCOPE).pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'code', title: translate.code },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action, orderEnabled: false },
    ])
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminPermissionsService.getPermissions(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<Policy>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private adminPermissionsService: AdminPermissionsService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService
  ) {
    super(state, router, activatedRoute);
    this.state.connect(this.request$.pipe(filter(isPresent)));
  }

  delete(id: string) {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('PERMISSION_TABLE.MESSAGES.deletePermission'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() =>
          this.adminPermissionsService
            .deletePermission(id)
            .pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
        ),
        catchError((err) =>
          this.promptService.open({
            icon: 'error',
            html: this.translocoService.translate(`ERRORS.${err.error.message}`),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('PERMISSION_TABLE.MESSAGES.deletePermissionSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
