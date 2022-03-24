import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, share, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { WorkingHours } from '../../../../models';
import { MyTimeService } from '../../../../services';
import { CreateUpdateTimesheetRequestDialogComponent } from '../create-update-timesheet-request-dialog/create-update-timesheet-request-dialog.component';
import { WorkingHoursDetailDialogComponent } from '../working-hour-detail-dialog/working-hours-detail-dialog.component';

@Component({
  selector: 'hcm-only-me-working-hours-list',
  templateUrl: './only-me-working-hours-list.component.html',
  styleUrls: ['./only-me-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class OnlyMeWorkingHoursListComponent extends AbstractServerSortPaginationTableComponent<WorkingHours> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'office', title: result['office'] },
        { key: 'date', title: result['date'] },
        { key: 'inTime', title: result['inTime'] },
        { key: 'outTime', title: result['outTime'] },
        {
          key: 'totalWorkingTime',
          title: result['totalWorkingTimeH'],
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'workingDay', title: result['workingDays'], cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'ot', title: result['ot'] },
        { key: 'onsiteDay', title: result['onsiteDay'], cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'leave', title: result['leave'] },
        { key: '', title: result['functions'], orderEnabled: false },
      ])
    );
  override queryParams = new HttpParams()
    .set('page', 0)
    .set('size', 10)
    .set('userId', this.authService.get('userInfo', 'userId'));
  private readonly request$ = this.fetch$.pipe(
    skip(1),
    switchMap(() => this.myTimeService.getWorkingHoursOfOnlyMe(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<WorkingHours>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly myTimeService: MyTimeService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onViewWorkingHoursDetail(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingHoursDetailDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.workingHoursDetail'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  requestUpdateTime(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateUpdateTimesheetRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.requestUpdateTimesheet'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onFilter(httpParams: HttpParams): void {
    this.queryParams = httpParams;
    this.fetch$.next();
  }
}
