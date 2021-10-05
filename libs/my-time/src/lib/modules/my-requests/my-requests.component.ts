import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import { SubmitOvertimeRequestDialogComponent } from './components/submit-overtime-request-dialog/submit-overtime-request-dialog.component';
import { SubmitWorkFromHomeRequestDialogComponent } from './components/submit-work-from-home-request-dialog/submit-work-from-home-request-dialog.component';
import { SubmitWorkingOutsideRequestDialogComponent } from './components/submit-working-outside-request-dialog/submit-working-outside-request-dialog.component';

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
        label: this.translocoService.translate('myTime.workFromHomeRequest'),
      })
      .pipe(
        tap(() => this.router.navigateByUrl('/my-time/my-requests/work-from-home')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onSubmitOvertimeRequest(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitOvertimeRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.overtimeRequest'),
      })
      .pipe(
        tap(() => this.router.navigateByUrl('/my-time/my-requests/working-after-hours')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onSubmitWorkingOutsideRequest(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(SubmitWorkingOutsideRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.workingOutsideRequest'),
      })
      .pipe(
        tap(() => this.router.navigateByUrl('/my-time/my-requests/working-outside')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
