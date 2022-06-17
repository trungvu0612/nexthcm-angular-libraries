import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { LeaveType } from '@nexthcm/my-time';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import {
  catchError,
  EMPTY,
  filter,
  from,
  iif,
  map,
  Observable,
  of,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { UpsertLeaveTypeDialogComponent } from '../../components/upsert-leave-type-dialog/upsert-leave-type-dialog.component';
import { LeaveConfigUrlPaths } from '../../models';

@Component({
  selector: 'hcm-leave-type-management',
  templateUrl: './leave-type-management.component.html',
  styleUrls: ['./leave-type-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class LeaveTypeManagementComponent
  extends AbstractServerSortPaginationTableComponent<LeaveType>
  implements AfterViewInit
{
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveType';
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('LEAVE_TYPES_MANAGEMENT_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'paidLeave', title: result.paidLeave, cssClass: { name: 'text-center', includeHeader: true } },
        {
          key: 'paidLeaveTransfer',
          title: result.canTransferTo,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() =>
      this.leaveConfigsService.getConfig<LeaveType>(this.leaveConfigAPIUrlPath, this.queryParams).pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );
  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<LeaveType>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly destroy$: TuiDestroyService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.activatedRoute.queryParamMap
      .pipe(
        map((queryParamMap) => queryParamMap.get('leaveTypeId')),
        filter(isPresent),
        switchMap((leaveTypeId) => this.leaveConfigsService.getLeaveType(leaveTypeId)),
        filter(isPresent),
        tap((leaveType) => {
          this.onUpsertLeaveType(leaveType);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onUpsertLeaveType(data?: LeaveType): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertLeaveTypeDialogComponent, this.injector), {
        label: this.translocoService.translate(
          `${this.translocoScope.scope}.${data ? 'editLeaveType' : 'createLeaveType'}`
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveLeaveType(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.removeLeaveType`),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.leaveConfigsService.delete(this.leaveConfigAPIUrlPath, id), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeLeaveTypeSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
