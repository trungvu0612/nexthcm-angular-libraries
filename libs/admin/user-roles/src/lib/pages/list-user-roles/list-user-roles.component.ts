import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AdminUserRole } from '../../models/admin-user-role';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';
import { UpsertUserRolesComponent } from '../upsert-user-roles/upsert-user-roles.component';

@Component({
  selector: 'hcm-list-user-roles',
  templateUrl: './list-user-roles.component.html',
  styleUrls: ['./list-user-roles.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUserRolesComponent extends AbstractServerPaginationTableComponent<AdminUserRole> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_USER_ROLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminUserRolesService.getAdminUserRoles(this.queryParams$.value).pipe(startWith(null))),
    share()
  );

  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    public state: RxState<Pagination<AdminUserRole>>,
    private adminUserRolesService: AdminUserRolesService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddUserRole(): void {
    this.openDialog('addNewUserRole')
      .pipe(
        switchMap((data) => this.adminUserRolesService.createAdminUserRole(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addUserRoleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  onRemoveUserRole(id: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteUserRole'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.adminUserRolesService.deleteAdminUserRoleId(id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('deleteUserRoleSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditUserRole(adminUserRole: AdminUserRole): void {
    this.openDialog('editUserRole', adminUserRole)
      .pipe(
        switchMap((data) => this.adminUserRolesService.createAdminUserRole(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateUserRoleSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: AdminUserRole): Observable<AdminUserRole> {
    return this.dialogService.open<AdminUserRole>(new PolymorpheusComponent(UpsertUserRolesComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
