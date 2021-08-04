import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { AbstractServerPaginationTableComponent, PromptService, ServerPaginationTableComponent } from '@nexthcm/cdk';
import { LevelApprove } from '../../models/level-approve';
import { from, Observable } from 'rxjs';
import { Columns } from 'ngx-easy-table';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { Pagination } from '@nexthcm/core';
import { TuiDialogService } from '@taiga-ui/core';
import { AdminLeaveLevelApproveService } from '../../services/admin-leave-level-approve.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { UpsertLeaveLevelApproveDialogComponent } from '../../components/upsert-leave-level-approve/upsert-leave-level-approve-dialog.component';

@Component({
  selector: 'hcm-leave-level-approve-management',
  templateUrl: './leave-level-approve-management.component.html',
  styleUrls: ['./leave-level-approve-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveLevelApproveManagementComponent
  extends AbstractServerPaginationTableComponent<LevelApprove>
  implements ServerPaginationTableComponent<LevelApprove>
{
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_LEVEL_APPROVE_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'leaveType', title: result.leaveType },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'totalLeave', title: result.totalLeave },
        { key: 'functions', title: result.functions },
      ])
    );

  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items').pipe();
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.levelApproveService.getAdminLevelApproves(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private translocoService: TranslocoService,
    private state: RxState<Pagination<LevelApprove>>,
    private promptService: PromptService,
    private levelApproveService: AdminLeaveLevelApproveService
  ) {
    super();
    state.connect(this.request$, (state, data) => {
      return setProp(
        data,
        'items',
        data.items.map((item) => this.getJobTitleName(item))
      );
    });
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeaveLevelApprove')
      .pipe(
        switchMap((data) => this.levelApproveService.createAdminLevelApprove(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  onRemoveLeaveLevel(id: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          text: this.translocoService.translate('deleteLeaveLevelApprove'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.levelApproveService.deleteAdminLevelApprove(id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(levelApprove: LevelApprove): void {
    this.openDialog('editLeaveLevelApprove', levelApprove)
      .pipe(
        switchMap((data) => this.levelApproveService.updateAdminLevelApprove(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LevelApprove): Observable<LevelApprove> {
    return this.dialogService.open<LevelApprove>(
      new PolymorpheusComponent(UpsertLeaveLevelApproveDialogComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }

  private getJobTitleName(levelApprove: LevelApprove): LevelApprove {
    if (!levelApprove.jobTitleDTOList) {
      return levelApprove;
    }
    levelApprove.jobTitlesName = levelApprove.jobTitleDTOList
      .filter(isPresent)
      .map((jobTitle) => jobTitle.name)
      .join(', ');
    return levelApprove;
  }
}
