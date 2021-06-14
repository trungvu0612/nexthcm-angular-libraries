import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { switchMap } from 'rxjs/operators';
import { CreateProcessDialogComponent } from '../../components/create-process-dialog/create-process-dialog.component';
import { Workflow } from '../../models/workflow';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-processes-management',
  templateUrl: './processes-management.component.html',
  styleUrls: ['./processes-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessesManagementComponent implements OnInit {
  configuration: Config = {
    ...DefaultConfig,
    checkboxes: true,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
  };
  columns: Columns[] = [
    { key: 'name', title: 'Process name' },
    { key: 'createdDate', title: 'Created Date' },
    { key: 'description', title: 'Description' },
    { key: 'createdBy', title: 'Created By' },
    { key: 'actions', title: 'Actions' },
  ];
  data: Workflow[] = [];

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private processesService: ProcessesService
  ) {}

  ngOnInit(): void {}

  onCreateProcess(): void {
    this.dialogService
      .open<Workflow>(new PolymorpheusComponent(CreateProcessDialogComponent, this.injector), {
        label: 'Create new process',
      })
      .pipe(switchMap((data) => this.processesService.createProcess(data)))
      .subscribe((data) => {
        this.router.navigate([1, 'edit'], { relativeTo: this.activatedRoute });
      });
  }
}
