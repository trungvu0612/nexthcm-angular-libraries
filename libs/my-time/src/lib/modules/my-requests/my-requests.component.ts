import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { finalize, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';
import { SubmitOvertimeRequestDialogComponent } from './components/submit-overtime-request-dialog/submit-overtime-request-dialog.component';
import { SubmitWorkFromHomeRequestDialogComponent } from './components/submit-work-from-home-request-dialog/submit-work-from-home-request-dialog.component';
import { SubmitWorkingOutsideRequestDialogComponent } from './components/submit-working-outside-request-dialog/submit-working-outside-request-dialog.component';
import { Router } from '@angular/router';

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
    private dialogService: TuiDialogService,
    private injector: Injector,
    private router: Router,
    private translocoService: TranslocoService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService
  ) {}

  onSubmitWorkFromHomeRequest(): void {
    this.dialogService
      .open(new PolymorpheusComponent(SubmitWorkFromHomeRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('workFromHomeRequest')
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.router.navigateByUrl('/my-time/my-requests/work-from-home'))
      )
      .subscribe(() => this.successPrompt());
  }

  onSubmitOvertimeRequest(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitOvertimeRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('overtimeRequest')
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.router.navigateByUrl('/my-time/my-requests/working-after-hours'))
      )
      .subscribe(() => this.successPrompt());
  }

  onSubmitWorkingOutsideRequest(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitWorkingOutsideRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('workingOutsideRequest')
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.router.navigateByUrl('/my-time/my-requests/working-outside')))
      .subscribe(() => this.successPrompt());
  }

  private successPrompt(): Promise<SweetAlertResult> {
    return this.promptService.open({
      icon: 'success',
      html: this.translocoService.translate('submitRequestSuccessfully'),
    });
  }
}
