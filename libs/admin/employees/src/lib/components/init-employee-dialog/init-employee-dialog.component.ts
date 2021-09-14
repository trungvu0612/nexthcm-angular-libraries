import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EmployeeGeneralInformation } from '@nexthcm/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-init-employee-dialog',
  templateUrl: './init-employee-dialog.component.html',
  styleUrls: ['./init-employee-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitEmployeeDialogComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<EmployeeGeneralInformation>) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(value: EmployeeGeneralInformation): void {
    this.context.completeWith(value);
  }
}
