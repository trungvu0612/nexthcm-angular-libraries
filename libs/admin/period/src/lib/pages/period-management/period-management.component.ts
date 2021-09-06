import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { LeavePeriod } from '../../../../../entitlement/src/lib/models/leave-period';
import { UpsertPeriodDialogComponent } from '../../components/upsert-period-dialog/upsert-period-dialog.component';
import { PeriodStatus } from '../../enums/status';
import { AdminPeriodService } from '../../services/admin-period.service';

@Component({
  selector: 'hcm-period-management',
  templateUrl: './period-management.component.html',
  styleUrls: ['./period-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class PeriodManagementComponent extends AbstractServerPaginationTableComponent<LeavePeriod> {
  @ViewChild('table') table!: BaseComponent;
  readonly PeriodStatus = PeriodStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_PERIOD_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'startDate', title: result.startDate },
        { key: 'endDate', title: result.endDate },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminPeriodService.getAdminPeriod(this.queryParams$.value)),
    map((res) => res.data)
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<LeavePeriod>>,
    private adminPeriodService: AdminPeriodService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeavePeriod')
      .pipe(
        switchMap((data) => this.adminPeriodService.createAdminPeriod(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addLeavePeriodSuccessfully', () =>
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
          switchMap(() => this.adminPeriodService.deleteAdminPeriod(id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(leavePeriod: LeavePeriod): void {
    this.openDialog('editLeaveLevelApprove', leavePeriod)
      .pipe(
        switchMap((data) => this.adminPeriodService.editAdminPeriod(data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveLevelApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeavePeriod): Observable<LeavePeriod> {
    return this.dialogService.open<LeavePeriod>(new PolymorpheusComponent(UpsertPeriodDialogComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
