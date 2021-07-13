import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { MyRequestService } from '../../../../services/my-request.service';
import { RequestsDialogComponent } from '../../../my-request/components/requests-dialog/requests-dialog.component';

@Component({
  selector: 'hcm-list-request-management',
  templateUrl: './list-request-management.component.html',
  styleUrls: ['./list-request-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRequestManagementComponent implements OnInit {
  activeItemIndex = 0;

  constructor(
    private myRequestService: MyRequestService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    console.log('cancel');
  }

  showDialog(type: string): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestsDialogComponent, this.injector), {
        closeable: false,
        data: { type: type },
      })
      .subscribe((cancel) => {
        if (cancel) {
          this.cancel();
        } else {
          this.activeItemIndex = type === 'ot' ? 0 : 2;
        }
      });
  }
}
