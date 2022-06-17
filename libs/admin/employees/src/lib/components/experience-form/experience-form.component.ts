import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeExperience, EmployeesService, parseTuiDayFields, PromptService } from '@nexthcm/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceFormComponent {
  readonly form = this.fb.group({});
  model = { experience: [{}] } as EmployeeExperience;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'experience',
      templateOptions: {
        translate: true,
        label: 'experience',
      },
      type: 'repeat',
      fieldArray: {
        fieldGroupClassName: 'grid grid-flow-col gap-4',
        fieldGroup: [
          {
            key: 'company',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'company',
            },
          },
          {
            key: 'jobTitle',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'jobTitle',
            },
          },
          {
            key: 'fromDate',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: 'startDate',
            },
          },
          {
            key: 'toDate',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: 'endDate',
            },
          },
          {
            key: 'description',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'description',
            },
          },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'WORK_EXPERIENCE')
    .pipe(
      tap((data) => {
        data.experience = data.experience?.map((experience) =>
          parseTuiDayFields(experience, ['fromDate', 'toDate'])
        ) || [{}];
        return (this.model = data);
      })
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeExperience>(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessfully'));
    }
  }
}
