import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { UpsertLeavePeriodDialogComponent } from '../../components/upsert-leave-period-dialog/upsert-leave-period-dialog.component';
import { PeriodStatus } from '../../enums/period-status';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeavePeriod } from '../../models/leave-period';

@Component({
  selector: 'hcm-leave-period-management',
  templateUrl: './leave-period-management.component.html',
  styleUrls: ['./leave-period-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeavePeriodManagementComponent extends AbstractServerSortPaginationTableComponent<LeavePeriod> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.Period;
  @ViewChild('table') table!: BaseComponent;
  readonly PeriodStatus = PeriodStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_PERIOD_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'startDate', title: result.startDate },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeavePeriod>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<LeavePeriod>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private leaveConfigsService: LeaveConfigsService,
    private destroy$: TuiDestroyService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state, router, activatedRoute);
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
    return this.dialogService.open<LeavePeriod>(
      new PolymorpheusComponent(UpsertLeavePeriodDialogComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }
}
