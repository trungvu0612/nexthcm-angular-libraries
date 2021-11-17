import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import {
  CreateWorkFromHomeRequestDialogComponent,
  CreateWorkingAfterHoursRequestDialogComponent,
  CreateWorkingOnsiteRequestDialogComponent,
} from '../../internal/components';
import { RequestDialogMetadata } from '../../internal/models';

const REQUEST_DIALOG_METADATA: RequestDialogMetadata = {
  workingAfterHours: {
    component: CreateWorkingAfterHoursRequestDialogComponent,
    label: 'myTime.overtimeRequest',
    route: '/my-time/my-requests/working-after-hours',
  },
  workingOnsite: {
    component: CreateWorkingOnsiteRequestDialogComponent,
    label: 'myTime.workingOnsiteRequest',
    route: '/my-time/my-requests/working-onsite',
  },
  workFromHome: {
    component: CreateWorkFromHomeRequestDialogComponent,
    label: 'myTime.workFromHomeRequest',
    route: '/my-time/my-requests/work-from-home',
  },
};

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

  onCreateRequest(type: keyof RequestDialogMetadata): void {
    const { component, label, route } = REQUEST_DIALOG_METADATA[type];

    this.dialogService
      .open(new PolymorpheusComponent(component, this.injector), {
        label: this.translocoService.translate(label),
      })
      .pipe(
        tap(() => this.router.navigateByUrl(route as string)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
