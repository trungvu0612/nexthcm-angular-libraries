import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MyRequestService } from '../../services';
import { RequestOtComponent } from './components/request-ot/request-ot.component';
import { RequestWorkOnsiteComponent } from './components/request-work-onsite/request-work-onsite.component';
import { SubmitWorkFromHomeRequestDialogComponent } from './components/submit-work-from-home-request-dialog/submit-work-from-home-request-dialog.component';

@Component({
  selector: 'hcm-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class MyRequestsComponent {
  activeItemIndex = 0;

  constructor(
    private myRequestService: MyRequestService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService
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

  onSubmitWorkFromHomeRequest(): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitWorkFromHomeRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('workFromHomeReq'),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.promptService.open({
          icon: 'success',
          html: this.translocoService.translate('MY_TIME.requestSuccess'),
        })
      );
  }
}
