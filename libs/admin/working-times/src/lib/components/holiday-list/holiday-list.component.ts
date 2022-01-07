import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Holiday, Pagination, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { WorkingTimesService } from '../../services/working-times.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';
import { UpsertHolidayDialogComponent } from '../upsert-holiday-dialog/upsert-holiday-dialog.component';

@Component({
  selector: 'hcm-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class HolidayListComponent implements AfterViewInit {
  @ViewChild('table') table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  queryParams = new HttpParams().set('page', 0).set('size', 10);
  readonly fetch$ = new Subject<void>();
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('HOLIDAY_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'dateHoliday', title: result.date },
        { key: 'name', title: result.name },
        { key: 'recurringType', title: result.repeat },
        { key: 'paidHoliday', title: result.payable, cssClass: { name: 'text-center', includeHeader: true } },
        { key: '', title: result.actions },
      ])
    );
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.workingTimesService.getHolidays(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false)),
    startWith(true)
  );

  constructor(
    private readonly state: RxState<Pagination<Holiday>>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly workingTimesService: WorkingTimesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  readonly item = (item: Holiday) => item;

  ngAfterViewInit(): void {
    this.fetch$.next();
  }

  onSize(size: number): void {
    this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: size });
    this.queryParams = this.queryParams.set('size', size);
    this.fetch$.next();
  }

  onPage(page: number): void {
    this.queryParams = this.queryParams.set('page', page);
    this.fetch$.next();
  }

  onUpsertHoliday(data?: Holiday): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertHolidayDialogComponent, this.injector), {
        label: this.translocoService.translate(
          data ? `${TRANSLATION_SCOPE}.editHoliday` : `${TRANSLATION_SCOPE}.addHoliday`
        ),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveHoliday(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${TRANSLATION_SCOPE}.deleteHoliday`),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.workingTimesService.deleteHoliday(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${TRANSLATION_SCOPE}.deleteHolidaySuccessfully`, () => this.fetch$.next())
      );
  }
}
