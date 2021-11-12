import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowsService, WorkflowStatus } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { isPresent, TuiContextWithImplicit, TuiDestroyService, TuiIdentityMatcher, TuiLetModule } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule, TuiTagModule } from '@taiga-ui/kit';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'hcm-workflow-status-combo-box-filter',
  templateUrl: './workflow-status-combo-box-filter.component.html',
  styleUrls: ['./workflow-status-combo-box-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class WorkflowStatusComboBoxFilterComponent implements OnInit {
  @Output() valueChange = new EventEmitter<string>();

  readonly search$ = new Subject<string | null>();
  readonly statuses$: Observable<WorkflowStatus[] | null> = this.search$.pipe(
    filter(isPresent),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => this.workflowsService.searchWorkflowStatuses(search).pipe(startWith(null))),
    startWith([]),
    shareReplay(1)
  );
  statuses: WorkflowStatus[] = [];
  statusId = this.activatedRoute.snapshot.queryParams.status || '';

  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService
  ) {}

  ngOnInit(): void {
    if (this.statusId) {
      this.workflowsService
        .getWorkflowStatus(this.statusId)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((statuses) => {
          this.statuses = statuses;
          this.valueChange.emit(statuses.map((value) => value.id).join(','));
        });
    }
  }

  identityMatcher: TuiIdentityMatcher<any> = (item1: WorkflowStatus, item2: WorkflowStatus) => item1.id === item2.id;

  stringify: TuiStringHandler<WorkflowStatus | TuiContextWithImplicit<WorkflowStatus>> = (item) =>
    'name' in item ? item.name : item.$implicit.name;

  onSelectStatus(values: WorkflowStatus[]): void {
    const ids = values.map((value) => value.id).join(',');

    this.statuses = values;
    this.valueChange.emit(ids);
    this.router.navigate([], {
      queryParams: { status: values.length ? ids : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

@NgModule({
  declarations: [WorkflowStatusComboBoxFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    TranslocoModule,
    TuiTagModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    PushModule,
  ],
  exports: [WorkflowStatusComboBoxFilterComponent],
})
export class WorkflowStatusComboBoxFilterComponentModule {}
