import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { WorkingHours } from '../../../../models';
import { WorkingHoursService } from '../../../../services';
import { SubmitUpdateTimesheetRequestDialogComponent } from '../submit-update-timesheet-request-dialog/submit-update-timesheet-request-dialog.component';
import { WorkingHoursDetailDialogComponent } from '../working-hour-detail-dialog/working-hours-detail-dialog.component';

@Component({
  selector: 'hcm-only-me-working-hours-list',
  templateUrl: './only-me-working-hours-list.component.html',
  styleUrls: ['./only-me-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState]
})
export class OnlyMeWorkingHoursListComponent extends AbstractServerSortPaginationTableComponent<WorkingHours> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'office', title: result.office },
        { key: 'date', title: result.date },
        { key: 'inTime', title: result.inTime },
        { key: 'outTime', title: result.outTime },
        {
          key: 'totalWorkingTime',
          title: result.totalWorkingTimeH,
          cssClass: { name: 'text-center', includeHeader: true }
        },
        { key: 'workingDay', title: result.workingDay, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'ot', title: result.ot },
        { key: 'onsiteDay', title: result.onsiteDay, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'wfh', title: result.workFromHome, cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'leave', title: result.leave },
        { key: '', title: result.functions, orderEnabled: false }
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.authService.get('userInfo', 'userId'))
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workingHoursService.getWorkingHoursOfOnlyMe(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<WorkingHours>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly workingHoursService: WorkingHoursService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onViewWorkingHoursDetail(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingHoursDetailDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.workingHoursDetail'),
        data
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  requestUpdateTime(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitUpdateTimesheetRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.requestUpdateTimesheet'),
        data
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.promptService.handleResponse('myTime.updateTimesheetSuccess'));
  }
}
