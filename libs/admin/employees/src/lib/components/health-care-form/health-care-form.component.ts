import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeHealthCare, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-health-care-form',
  templateUrl: './health-care-form.component.html',
  styleUrls: ['./health-care-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class HealthCareFormComponent {
  form = this.fb.group({} as EmployeeHealthCare);
  model = { attachments: [{}] } as EmployeeHealthCare;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-1 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'healthCareNumber',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.healthCareNumber`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterHealthCareNumber`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      className: 'tui-form__row block',
      fieldGroup: [
        {
          key: 'startDate',
          type: 'input-date',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.startDate`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterStartDate`,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'healthCareLevel',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.healthCareLevel`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterHealthCareLevel`,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      className: 'tui-form__row block',
      fieldGroup: [
        {
          key: 'noOfDependantPaidByEmployer',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.noOfDependantPaidByEmployer`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterNoOfDependantPaidByEmployer`,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'noOfDependantPaidByEmployee',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.noOfDependantPaidByEmployee`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterNoOfDependantPaidByEmployee`,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
    {
      key: 'attachments',
      type: 'repeat',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        label: `${this.translocoScope.scope}.attachmentFiles`,
      },
      fieldArray: {
        fieldGroupClassName: 'flex space-x-2 items-center',
        fieldGroup: [
          {
            key: 'file',
            className: 'flex-1',
            type: 'sharing-file',
            templateOptions: {
              labelClassName: 'font-semibold',
              serverRequest: (file: File) => this.filesService.uploadFile('employee', file, false, true),
            },
            expressionProperties: {
              'templateOptions.onUploadedFile': (_, __, field) => (value: string) =>
                field?.form?.controls?.['path']?.setValue(value),
            },
          },
          { key: 'path', type: 'download-button' },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly filesService: FilesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'PIT')
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  onSubmit(): void {
    // if (this.form.valid) {
    //   this.adminEmployeeService
    //     .updateEmployeeInformation<EmployeePIT>(this.form.value)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(this.promptService.handleResponse('updateSuccessfully'));
    // }
  }
}
