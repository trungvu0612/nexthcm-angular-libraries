import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeGeneralInformation, PromptService } from '@nexthcm/cdk';
import { AdminEmployeesService } from '../../services/admin-employees.service';

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
    private readonly promptService: PromptService
  ) {}

  onSubmitGeneralInformationForm(payload: EmployeeGeneralInformation): void {
    this.adminEmployeeService
      .updateEmployeeGeneralInformation(payload)
      .subscribe(this.promptService.handleResponse('updateSuccess'));
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
