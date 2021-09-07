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
import { UpsertLeavePeriodComponent } from '../../components/upsert-leave-period/upsert-leave-period.component';
import { PeriodStatus } from '../../enums/status';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeavePeriod } from '../../models/leave-period';

@Component({
  selector: 'hcm-list-leave-period',
  templateUrl: './list-leave-period.component.html',
  styleUrls: ['./list-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class ListLeavePeriodComponent extends AbstractServerPaginationTableComponent<LeavePeriod> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.leavePeriods;
  @ViewChild('table') table!: BaseComponent;
  readonly PeriodStatus = PeriodStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_PERIOD_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'startDate', title: result.startDate },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService.getConfig<LeavePeriod>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
    ),
    map((res) => res.data)
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<LeavePeriod>>,
    private leaveConfigsService: LeaveConfigsService,
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
        switchMap((data) => this.leaveConfigsService.create<LeavePeriod>(this.leaveConfigAPIUrlPath, data)),
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
          html: this.translocoService.translate('deleteLeavePeriod'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeLeavePeriodSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(leavePeriod: LeavePeriod): void {
    this.openDialog('editLeavePeriod', leavePeriod)
      .pipe(
        switchMap((data) => this.leaveConfigsService.edit<LeavePeriod>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeavePeriodSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeavePeriod): Observable<LeavePeriod> {
    return this.dialogService.open<LeavePeriod>(new PolymorpheusComponent(UpsertLeavePeriodComponent, this.injector), {
      label: this.translocoService.translate(label),
      size: 'l',
      data,
    });
  }
}
