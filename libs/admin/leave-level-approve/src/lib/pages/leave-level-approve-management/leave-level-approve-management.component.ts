import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState, setProp } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertLeaveLevelApproveDialogComponent } from '../../components/upsert-leave-level-approve/upsert-leave-level-approve-dialog.component';
import { LevelApprove } from '../../models/level-approve';
import { AdminLeaveLevelApproveService } from '../../services/admin-leave-level-approve.service';

@Component({
  selector: 'hcm-leave-level-approve-management',
  templateUrl: './leave-level-approve-management.component.html',
  styleUrls: ['./leave-level-approve-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveLevelApproveManagementComponent extends AbstractServerPaginationTableComponent<LevelApprove> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$: Observable<Columns[]> = this.translocoService
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
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.levelApproveService.getAdminLevelApproves(this.queryParams$.value)),
    map((res) => res.data)
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<LevelApprove>>,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private levelApproveService: AdminLeaveLevelApproveService
  ) {
    super(state);
    state.connect(this.request$, (state, data) =>
      setProp(
        data,
        'items',
        data.items.map((item) => LeaveLevelApproveManagementComponent.getJobTitleName(item))
      )
    );
  }

  private static getJobTitleName(levelApprove: LevelApprove): LevelApprove {
    if (!levelApprove.jobTitleDTOList) {
      return levelApprove;
    }
    levelApprove.jobTitlesName = levelApprove.jobTitleDTOList
      .map((jobTitle) => jobTitle.name)
      .filter(isPresent)
      .join(', ');
    return levelApprove;
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
          html: this.translocoService.translate('deleteLeaveLevelApprove'),
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
}
