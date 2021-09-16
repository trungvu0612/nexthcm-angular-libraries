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
import { UpsertLeaveEntitlementDialogComponent } from '../../components/upsert-leave-entitlement/upsert-leave-entitlement-dialog.component';
import { LeaveConfigAPIUrlPath, LeaveConfigsService } from '../../leave-configs.service';
import { LeaveEntitlement } from '../../models/leave-entitlement';

@Component({
  selector: 'hcm-leave-entitlement-management',
  templateUrl: './leave-entitlement-management.component.html',
  styleUrls: ['./leave-entitlement-management.component.scss'],
  providers: [TuiDestroyService, RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveEntitlementManagementComponent extends AbstractServerPaginationTableComponent<LeaveEntitlement> {
  readonly leaveConfigAPIUrlPath = LeaveConfigAPIUrlPath.Entitlement;
  @ViewChild('table') table!: BaseComponent;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_LEAVE_ENTITLEMENT_MANAGEMENT_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'period', title: result.period },
        { key: 'jobTitle', title: result.jobTitle },
        { key: 'totalLeave', title: result.totalLeave },
        { key: 'functions', title: result.functions },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() =>
      this.leaveConfigsService
        .getConfig<LeaveEntitlement>(this.leaveConfigAPIUrlPath, this.queryParams$.value)
        .pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value), catchError(() => of(false)));

  constructor(
    public state: RxState<Pagination<LeaveEntitlement>>,
    private destroy$: TuiDestroyService,
    private leaveConfigsService: LeaveConfigsService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onAddLeaveLevel(): void {
    this.openDialog('addLeaveEntitlementApprove')
      .pipe(
        switchMap((data) => this.leaveConfigsService.create<LeaveEntitlement>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('addLeaveEntitlementApproveSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  onRemoveLeaveLevel(id: string): void {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteLeaveEntitlement'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id)),
          takeUntil(this.destroy$)
        )
        .subscribe(
          this.promptService.handleResponse('removeEmployeeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  onEditLeaveLevelApprove(leaveEntitlement: LeaveEntitlement): void {
    this.openDialog('editLeaveEntitlement', leaveEntitlement)
      .pipe(
        switchMap((data) => this.leaveConfigsService.edit<LeaveEntitlement>(this.leaveConfigAPIUrlPath, data)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('updateLeaveEntitlementSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }

  private openDialog(label: string, data?: LeaveEntitlement): Observable<LeaveEntitlement> {
    return this.dialogService.open<LeaveEntitlement>(
      new PolymorpheusComponent(UpsertLeaveEntitlementDialogComponent, this.injector),
      {
        label: this.translocoService.translate(label),
        size: 'l',
        data,
      }
    );
  }
}
