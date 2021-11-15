import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { CreateLeaveRequestDialogComponent } from '../../internal/components/create-leave-request-dialog/create-leave-request-dialog.component';

@Component({
  selector: 'hcm-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestManagementComponent {
  activeItemIndex = 0;

  constructor(
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService
  ) {}

  onCreateEmployeeLeaveRequest(): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateLeaveRequestDialogComponent, this.injector), {
        label: this.translocoService.translate('myTime.submitLeaveRequest'),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
