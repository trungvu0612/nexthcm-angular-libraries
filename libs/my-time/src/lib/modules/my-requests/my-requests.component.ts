import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import { CreateWorkFromHomeRequestDialogComponent } from './components/create-work-from-home-request-dialog/create-work-from-home-request-dialog.component';
import { CreateWorkingAfterHoursRequestDialogComponent } from './components/create-working-after-hours-request-dialog/create-working-after-hours-request-dialog.component';
import { CreateWorkingOnsiteRequestDialogComponent } from './components/create-working-onsite-request-dialog/create-working-onsite-request-dialog.component';

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
      .open(new PolymorpheusComponent(CreateWorkFromHomeRequestDialogComponent, this.injector), {
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
      .open<boolean>(new PolymorpheusComponent(CreateWorkingAfterHoursRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.overtimeRequest'),
      })
      .pipe(
        tap(() => this.router.navigateByUrl('/my-time/my-requests/working-after-hours')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onSubmitWorkingOnsiteRequest(): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(CreateWorkingOnsiteRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.workingOnsiteRequest'),
      })
      .pipe(
        tap(() => this.router.navigateByUrl('/my-time/my-requests/working-onsite')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
