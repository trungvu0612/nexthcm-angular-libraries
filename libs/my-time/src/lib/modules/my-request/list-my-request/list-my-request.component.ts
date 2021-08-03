import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { switchMap } from 'rxjs/operators';
import { RequestsDialogComponent } from '../../../components/requests-dialog/requests-dialog.component';
import { MyRequestService } from '../../../services/my-request.service';
import { RequestOtComponent } from '../request-ot/request-ot.component';

@Component({
  selector: 'hcm-list-my-request',
  templateUrl: './list-my-request.component.html',
  styleUrls: ['./list-my-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMyRequestComponent {
  activeItemIndex = 0;

  constructor(
    private myRequestService: MyRequestService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {}

  cancel(): void {
    console.log('cancel');
  }

  showDialog(type: string): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestsDialogComponent, this.injector), {
        closeable: false,
        data: { type: type },
      })
      .pipe(switchMap((data) => this.myRequestService.submitRequestOutside(data, type)))
      .subscribe(this.promptService.handleResponse('MY_TIME.requestOnsiteSuccess'));
  }

  showDialogWFH(): void {
    this.dialogService
      .open<any>(new PolymorpheusComponent(RequestOtComponent, this.injector), {
        closeable: false,
        // data: { type: type },
      })
      .pipe(switchMap((data) => this.myRequestService.submitRequestFromHome(data)))
      .subscribe(this.promptService.handleResponse('MY_TIME.requestSuccess'));
  }
}
