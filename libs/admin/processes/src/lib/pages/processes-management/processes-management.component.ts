import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { CreateProcessDialogComponent } from '../../components/create-process-dialog/create-process-dialog.component';
import { Process, ProcessInit } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-processes-management',
  templateUrl: './processes-management.component.html',
  styleUrls: ['./processes-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessesManagementComponent {
  @ViewChild('table') table!: BaseComponent;

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
  private readonly refresh$ = new Subject();
  private readonly request$ = combineLatest([this.queryParams$, this.refresh$]).pipe(
    startWith([]),
    switchMap(([queryParams]) => this.processesService.getProcesses(queryParams)),
    map((res) => res.data),
    share()
  );
  readonly data$ = this.request$.pipe(map((data) => data.items));
  readonly loading$ = this.request$.pipe(map((value) => !value));
  readonly total$ = this.request$.pipe(
    filter(isPresent),
    map(({ totalElements }) => totalElements),
    startWith(1)
  );

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService
  ) {}

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
    //
  }
}
