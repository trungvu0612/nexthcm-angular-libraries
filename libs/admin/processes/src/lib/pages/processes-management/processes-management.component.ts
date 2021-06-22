import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '@nexthcm/core';
import { PromptComponent } from '@nexthcm/ui';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CreateProcessDialogComponent } from '../../components/create-process-dialog/create-process-dialog.component';
import { Process, ProcessInit } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-processes-management',
  templateUrl: './processes-management.component.html',
  styleUrls: ['./processes-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class ProcessesManagementComponent {
  @ViewChild('table') table!: BaseComponent;
  @ViewChild('prompt') prompt!: PromptComponent;

  configuration: Config = {
    ...DefaultConfig,
    checkboxes: true,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  columns: Columns[] = [
    { key: 'name', title: 'Process name' },
    { key: 'description', title: 'Description' },
    { key: 'createdBy', title: 'Created By' },
    { key: 'operators', title: 'Operators' },
  ];
  allSelected: boolean | null = false;
  readonly selected = new Set<string>();
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', '0').set('size', 10));
  readonly loading$ = this.state.$.pipe(map((value) => !value));
  readonly data$ = this.state.select('items');
  readonly total$ = this.state.select('totalElements');
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.processesService.getProcesses(this.queryParams$.value)),
    map((res) => res.data)
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService,
    private destroy$: TuiDestroyService,
    private state: RxState<Pagination<Process>>
  ) {
    state.connect(this.request$);
  }

  readonly process = (item: Process) => item;

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  onCreateProcess(): void {
    this.dialogService
      .open<ProcessInit>(new PolymorpheusComponent(CreateProcessDialogComponent, this.injector), {
        label: 'Create new process',
      })
      .pipe(switchMap((data) => this.processesService.initProcess(data)))
      .subscribe((res) => {
        this.router.navigate([res.data.id, 'edit'], { relativeTo: this.activatedRoute });
      });
  }

  tableEventEmitted(tableEvent: { event: string; value: any }): void {
    if (tableEvent.event === 'onSelectAll') {
      this.selected.clear();
      this.allSelected = !this.allSelected;
      if (this.allSelected) {
        this.table.data.forEach((row) => this.selected.add(row.id));
      }
    }
    if (tableEvent.event === 'onOrder') {
      this.queryParams$.next(this.queryParams$.value.set('sort', `${tableEvent.value.key},${tableEvent.value.order}`));
    }
  }

  rowSelected(row: Process, value: boolean): void {
    if (row.id) {
      value ? this.selected.add(row.id) : this.selected.delete(row.id);
    }
    if (!this.selected.size) {
      this.allSelected = false;
    } else {
      this.allSelected = this.allSelected = this.selected.size !== this.table.data.length ? null : true;
    }
  }

  onRemoveProcess(id?: string): void {
    if (id) {
      from(this.prompt.open({ icon: 'question', text: 'Are you sure you want to delete this process?' }))
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() => this.processesService.deleteProcess(id)),
          tap(() => this.queryParams$.next(this.queryParams$.value)),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
}
