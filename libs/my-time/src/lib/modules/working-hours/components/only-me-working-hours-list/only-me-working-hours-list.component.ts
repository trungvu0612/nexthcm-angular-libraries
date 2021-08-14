import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { WorkingHours } from '../../../../models';
import { WorkingHoursService } from '../../../../services';
import { SubmitUpdateTimesheetRequestDialogComponent } from '../submit-update-timesheet-request-dialog/submit-update-timesheet-request-dialog.component';
import { WorkingHoursDetailDialogComponent } from '../working-hour-detail-dialog/working-hours-detail-dialog.component';

@Component({
  selector: 'hcm-only-me-working-hours-list',
  templateUrl: './only-me-working-hours-list.component.html',
  styleUrls: ['./only-me-working-hours-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class OnlyMeWorkingHoursListComponent extends AbstractServerPaginationTableComponent<WorkingHours> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('WORKING_HOURS_TABLE_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'office', title: result.office },
        { key: 'date', title: result.date },
        { key: 'inTime', title: result.inTime },
        { key: 'outTime', title: result.outTime },
        { key: 'totalWorkingTime', title: result.totalWorkingTimeH },
        { key: 'workingDay', title: result.workingDay },
        { key: 'ot', title: result.ot },
        { key: 'onsiteDay', title: result.onsiteDay },
        { key: 'wfh', title: result.workFromHome },
        { key: 'leave', title: result.leave },
        { key: 'actions', title: result.functions },
      ])
    );
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams().set('page', 0).set('size', 10).set('userId', this.authService.get('userInfo', 'userId'))
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.workingHoursService.getWorkingHoursOfOnlyMe(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    public state: RxState<Pagination<WorkingHours>>,
    private workingHoursService: WorkingHoursService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private authService: AuthService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onViewWorkingHoursDetail(data: WorkingHours): void {
    this.dialogService
      .open(new PolymorpheusComponent(WorkingHoursDetailDialogComponent, this.injector), {
        label: this.translocoService.translate('workingHoursDetail'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  requestUpdateTime(id: string): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitUpdateTimesheetRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('requestUpdateTimesheet'),
        data: id,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
