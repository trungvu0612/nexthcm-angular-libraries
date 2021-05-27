import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { MyRequestData } from '../../models/my-time';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';

@Component({
  selector: 'hcm-request-data-table',
  templateUrl: './request-data-table.component.html',
  styleUrls: ['./request-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: Partial<MyRequestData>[];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  cancel(): void {
    console.log('cancel');
  }

  showDialog(item: Partial<MyRequestData>): void {
    let title, group;
    switch (this.columns[2]) {
      case 'spentTime':
        title = 'Overtime Detail';
        group = 'overTime';
        break;
      case 'dayOfWeek':
        title = 'Working Outside Detail';
        group = 'updateTime';
        break;
      default:
        title = 'Working Outside Detail';
        group = 'workingOutside';
    }
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestDialogComponent, this.injector), {
        closeable: false,
        data: { item, title, group },
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
