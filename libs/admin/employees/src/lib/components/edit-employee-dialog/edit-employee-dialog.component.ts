import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import {
  EmployeeAttachmentQuery,
  EmployeeAttachmentStore,
  EmployeeDurationQuery,
  EmployeeDurationStore,
  EmployeeEducationQuery,
  EmployeeEducationStore,
  EmployeeGeneralQuery,
  EmployeeGeneralStore,
  EmployeeIndividualQuery,
  EmployeeIndividualStore,
  EmployeeQuery,
  EmployeeSHUIQuery,
  EmployeeSHUIStore,
  EmployeeStore,
} from '../../state';

@Component({
  selector: 'hcm-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EmployeeStore,
    EmployeeQuery,
    EmployeeGeneralStore,
    EmployeeGeneralQuery,
    EmployeeIndividualStore,
    EmployeeIndividualQuery,
    EmployeeDurationStore,
    EmployeeDurationQuery,
    EmployeeEducationStore,
    EmployeeEducationQuery,
    EmployeeSHUIStore,
    EmployeeSHUIQuery,
    EmployeeAttachmentStore,
    EmployeeAttachmentQuery,
  ],
})
export class EditEmployeeDialogComponent implements OnInit {
  activeItemIndex = 0;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<void, string>,
    private readonly employeeStore: EmployeeStore
  ) {}

  ngOnInit(): void {
    this.employeeStore.update({ id: this.context.data });
  }
}
