import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService, TuiHostedDropdownComponent } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import {
  CreateLeaveRequestDialogComponent,
  CreateWorkFromHomeRequestDialogComponent,
  CreateWorkingAfterHoursRequestDialogComponent,
  CreateWorkingOnsiteRequestDialogComponent,
} from '../../internal/components';
import { RequestDialogMetadata } from '../../internal/models';

const EMPLOYEE_REQUEST_DIALOG_METADATA: RequestDialogMetadata = {
  leave: {
    component: CreateLeaveRequestDialogComponent,
    label: 'myTime.submitLeaveRequest',
  },
  workingAfterHours: {
    component: CreateWorkingAfterHoursRequestDialogComponent,
    label: 'myTime.overtimeRequest',
  },
  workingOnsite: {
    component: CreateWorkingOnsiteRequestDialogComponent,
    label: 'myTime.workingOnsiteRequest',
  },
  workFromHome: {
    component: CreateWorkFromHomeRequestDialogComponent,
    label: 'myTime.workFromHomeRequest',
  },
};

@Component({
  selector: 'hcm-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestManagementComponent {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;

  activeItemIndex = 0;
  open = false;

  constructor(
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService
  ) {}

  onCreateEmployeeRequest(type: keyof RequestDialogMetadata): void {
    const { component, label } = EMPLOYEE_REQUEST_DIALOG_METADATA[type];

    this.closeDropdown();
    this.dialogService
      .open(new PolymorpheusComponent(component, this.injector), {
        label: this.translocoService.translate(label),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private closeDropdown(): void {
    this.open = false;
    if (this.component?.nativeFocusableElement) {
      this.component.nativeFocusableElement.focus();
    }
  }
}
