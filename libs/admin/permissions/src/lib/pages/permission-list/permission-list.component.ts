import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Policy } from '@nexthcm/admin-permissions';
import { Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent {
  @ViewChild('table') table!: BaseComponent;
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  configuration: Config = {
    ...DefaultConfig,
    checkboxes: false,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  readonly columns$ = this.translocoService.selectTranslateObject('PERMISSION_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'code', title: translate.code },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action },
    ])
  );
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminPermissionsService.getPermissions(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private adminPermissionsService: AdminPermissionsService,
    private state: RxState<Pagination<Policy>>,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    state.connect(this.request$);
  }

  readonly item = (item: Policy) => item;

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
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
