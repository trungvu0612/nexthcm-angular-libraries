import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeGeneralInformation, PromptService } from '@nexthcm/cdk';
import { tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeGeneralStore } from '../../state';

@Component({
  selector: 'hcm-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent {
  constructor(
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly promptService: PromptService,
    @Optional() private readonly employeeGeneralStore: EmployeeGeneralStore
  ) {}

  onSubmitGeneralInformationForm(payload: EmployeeGeneralInformation): void {
    this.adminEmployeeService
      .updateEmployeeGeneralInformation(payload)
      .pipe(tap(() => this.employeeGeneralStore?.update(payload)))
      .subscribe(this.promptService.handleResponse('updateSuccessful'));
  }
}
