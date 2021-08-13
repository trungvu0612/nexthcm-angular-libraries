import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { switchMap } from 'rxjs/operators';
import { MyRequestService } from '../../services';
import { RequestOtComponent } from './components/request-ot/request-ot.component';
import { RequestWorkOnsiteComponent } from './components/request-work-onsite/request-work-onsite.component';
import { RequestsDialogComponent } from './components/requests-dialog/requests-dialog.component';

@Component({
  selector: 'hcm-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRequestsComponent {
  activeItemIndex = 0;

  constructor(
    private myRequestService: MyRequestService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {}

  showDialogOT(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestOtComponent, this.injector), {})
      .pipe(switchMap((data) => this.myRequestService.submitRequestOT(data)))
      .subscribe(this.promptService.handleResponse('MY_TIME.requestOnsiteSuccess'));
  }

  showDialogWorkOnsite(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(RequestWorkOnsiteComponent, this.injector), {})
      .pipe(switchMap((data) => this.myRequestService.submitRequestOutside(data)))
      .subscribe(this.promptService.handleResponse('MY_TIME.requestOnsiteSuccess'));
  }

  showDialogWFH(): void {
    this.dialogService
      .open<any>(new PolymorpheusComponent(RequestsDialogComponent, this.injector), {})
      .pipe(switchMap((data) => this.myRequestService.submitRequestFromHome(data)))
      .subscribe(this.promptService.handleResponse('MY_TIME.requestSuccess'));
  }
}
