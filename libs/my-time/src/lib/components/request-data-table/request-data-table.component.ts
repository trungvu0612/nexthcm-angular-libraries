import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { MyRequestData } from '../../models/my-time';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';

@Component({
  selector: 'hcm-request-data-table',
  templateUrl: './request-data-table.component.html',
  styleUrls: ['./request-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDataTableComponent implements OnInit {
  @Input() columns!: string[];
  @Input() data!: MyRequestData[];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  cancel(): void {
    console.log('cancel');
  }

  showDialog(item: MyRequestData): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestDialogComponent, this.injector), {
        closeable: false,
        data: item,
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }
}
