import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Policy } from '@nexthcm/admin-permissions';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { from } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListComponent extends AbstractServerPaginationTableComponent<Policy> {
  @ViewChild('table') table!: BaseComponent;
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly columns$ = this.translocoService.selectTranslateObject('PERMISSION_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'code', title: translate.code },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action }
    ])
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminPermissionsService.getPermissions(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private adminPermissionsService: AdminPermissionsService,
    state: RxState<Pagination<Policy>>,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
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
          this.adminPermissionsService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
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
