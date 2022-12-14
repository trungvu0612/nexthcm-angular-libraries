import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { EditScheduledTaskDialogComponent } from '../../components/edit-scheduled-task-dialog/edit-scheduled-task-dialog.component';
import { ScheduleType } from '../../enums';
import { ScheduledTask } from '../../models/scheduled-task';
import { TaskSchedulerService } from '../../services/task-scheduler.service';

@Component({
  selector: 'hcm-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class TaskSchedulerComponent extends AbstractServerPaginationTableComponent<ScheduledTask> {
  readonly CommonStatus = CommonStatus;
  readonly ScheduleType = ScheduleType;
  readonly columns$ = this.translocoService
    .selectTranslateObject('ADMIN_TASK_SCHEDULER_COLUMNS', {}, this.translocoScope.scope)
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
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.taskSchedulerService.getScheduledTasks(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly translocoService: TranslocoService,
    private readonly taskSchedulerService: TaskSchedulerService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly alertService: TuiAlertService,
    readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    state: RxState<Pagination<ScheduledTask>>
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onEditScheduledTask(data: ScheduledTask): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(EditScheduledTaskDialogComponent, this.injector), {
        label: this.translocoService.translate(this.translocoScope.scope + '.editScheduledTask'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onExecute(id: string): void {
    this.taskSchedulerService
      .executeManually(id)
      .pipe(
        tap(this.promptService.handleResponse()),
        switchMap(() =>
          this.alertService.open('', {
            label: this.translocoService.translate(this.translocoScope.scope + '.executeTask'),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
