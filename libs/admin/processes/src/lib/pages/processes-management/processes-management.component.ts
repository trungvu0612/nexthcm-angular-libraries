import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { CreateProcessDialogComponent } from '../../components/create-process-dialog/create-process-dialog.component';
import { Workflow } from '../../models/workflow';
import { ProcessesService } from '../../services/processes.service';
import { isPresent } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'hcm-processes-management',
  templateUrl: './processes-management.component.html',
  styleUrls: ['./processes-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessesManagementComponent {
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
  readonly process = (item: Workflow) => item;

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService
  ) {}

  onSize(size: number): void {
    this.queryParams$.next(this.queryParams$.value.set('size', size.toString()));
  }

  onPage(page: number): void {
    this.queryParams$.next(this.queryParams$.value.set('page', page.toString()));
  }

  onCreateProcess(): void {
    this.dialogService
      .open<Workflow>(new PolymorpheusComponent(CreateProcessDialogComponent, this.injector), {
        label: 'Create new process',
      })
      .pipe(switchMap((data) => this.processesService.initProcess(data)))
      .subscribe((res) => {
        this.router.navigate([res.data.processId, 'edit'], { relativeTo: this.activatedRoute });
      });
  }
}
