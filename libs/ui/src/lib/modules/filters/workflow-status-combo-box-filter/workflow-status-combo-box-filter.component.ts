import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowsService, WorkflowStatus } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { isPresent, TuiDestroyService, TuiIdentityMatcher, TuiStringMatcher } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiComboBoxModule, TuiTagModule } from '@taiga-ui/kit';
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
  @Output() valueChange = new EventEmitter<WorkflowStatus | null>();

  readonly search$ = new Subject<string | null>();
  readonly statuses$: Observable<WorkflowStatus[] | null> = this.search$.pipe(
    filter(isPresent),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => this.workflowsService.searchWorkflowStatuses(search).pipe(startWith(null))),
    startWith([]),
    shareReplay(1)
  );
  status: WorkflowStatus | null = null;
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
        .subscribe((status) => {
          this.status = status;
          this.valueChange.emit(status);
        });
    }
  }

  @Input() identityMatcher: TuiIdentityMatcher<any> = (item1: WorkflowStatus, item2: WorkflowStatus) =>
    item1.id === item2.id;

  @Input() stringify: TuiStringHandler<any> = (item: WorkflowStatus) => item.name;

  @Input() strictMatcher: TuiStringMatcher<WorkflowStatus> = (
    item: WorkflowStatus,
    search: string,
    stringify: TuiStringHandler<WorkflowStatus>
  ) => !!item.id && stringify(item).toLowerCase() === search.toLowerCase();

  onSelectStatus(value: WorkflowStatus | null): void {
    this.status = value;
    this.valueChange.emit(value);
    this.router.navigate([], {
      queryParams: { status: value ? value.id : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

@NgModule({
  declarations: [WorkflowStatusComboBoxFilterComponent],
  imports: [
    CommonModule,
    TuiComboBoxModule,
    FormsModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TuiLoaderModule,
    TranslocoModule,
    TuiTagModule,
  ],
  exports: [WorkflowStatusComboBoxFilterComponent],
})
export class WorkflowStatusComboBoxFilterComponentModule {}
