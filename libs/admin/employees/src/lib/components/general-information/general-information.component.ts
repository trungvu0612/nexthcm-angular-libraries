import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeGeneralInformation, EmployeesService, PromptService } from '@nexthcm/cdk';

@Component({
  selector: 'hcm-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly promptService: PromptService
  ) {}

  onSubmitGeneralInformationForm(payload: EmployeeGeneralInformation): void {
    this.employeesService
      .updateEmployeeGeneralInformation(payload)
      .subscribe(this.promptService.handleResponse('updateSuccessfully'));
  }
}
