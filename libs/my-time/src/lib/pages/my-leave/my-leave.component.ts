import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { SubmitLeaveRequestDialogComponent } from '../../components/submit-leave-request-dialog/submit-leave-request-dialog.component';

@Component({
  selector: 'hcm-my-leave',
  templateUrl: './my-leave.component.html',
  styleUrls: ['./my-leave.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLeaveComponent implements OnInit {
  dateControl = new FormControl<Date>();
  columns = ['date', 'leaveType', 'days', 'status', 'sendTo', 'action'];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  showDialog() {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitLeaveRequestDialogComponent, this.injector), {
        closeable: false,
        // data: item,
      })
      .subscribe((cancel) => {
        if (cancel) this.cancel();
      });
  }

  cancel(): void {
    console.log('cancel');
  }
}
