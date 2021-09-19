import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { from, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Policy } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent extends AbstractServerPaginationTableComponent<Policy> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService.selectTranslateObject('PERMISSION_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'code', title: translate.code },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action },
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
    private adminPermissionsService: AdminPermissionsService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService
  ) {
    super(state);
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
      .subscribe();
  }
}
