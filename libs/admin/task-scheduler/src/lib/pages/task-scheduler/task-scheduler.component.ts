import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService, TuiNotificationsService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { EditScheduledTaskDialogComponent } from '../../components/edit-scheduled-task-dialog/edit-scheduled-task-dialog.component';
import { ScheduleType } from '../../enums';
import { ScheduledTask } from '../../models/scheduled-task';
import { TaskSchedulerService } from '../../services/task-scheduler.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

interface CommonState {
  data: ScheduledTask[];
}

@Component({
  selector: 'hcm-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class TaskSchedulerComponent implements OnInit {
  @ViewChild('table', { static: true }) table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly CommonStatus = CommonStatus;
  readonly ScheduleType = ScheduleType;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_TASK_SCHEDULER_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'type', title: result.type },
        { key: 'value', title: result.value },
        { key: 'status', title: result.status },
        { key: '', title: result.functions },
      ])
    );
  readonly data$ = this.state.select('data');
  private readonly refresh$ = new Subject<void>();
  private readonly request$ = this.refresh$.pipe(
    switchMap(() => this.TaskSchedulerService.getScheduledTasks().pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly TaskSchedulerService: TaskSchedulerService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly notificationsService: TuiNotificationsService,
    private readonly state: RxState<CommonState>
  ) {
    state.connect(
      'data',
      this.request$.pipe(
        filter(isPresent),
        tap((data) => {
          this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: data.length });
        })
      )
    );
  }

  readonly item = (item: ScheduledTask) => item;

  ngOnInit(): void {
    this.refresh$.next();
  }

  onEditScheduledTask(data: ScheduledTask): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(EditScheduledTaskDialogComponent, this.injector), {
        label: this.translocoService.translate('SCHEDULER.editScheduledTask'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh$.next());
  }

  onExecute(id: string): void {
    this.TaskSchedulerService.executeManually(id)
      .pipe(
        tap(this.promptService.handleResponse('')),
        switchMap(() =>
          this.notificationsService.show('', { label: this.translocoService.translate('SCHEDULER.executeTask') })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
