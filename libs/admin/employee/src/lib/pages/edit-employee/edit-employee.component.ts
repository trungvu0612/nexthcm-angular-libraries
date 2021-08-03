import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { EmployeeGeneralInformation } from '../../models';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeComponent {
  activeItemIndex = 0;

  constructor(
    private adminEmployeeService: AdminEmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService
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
