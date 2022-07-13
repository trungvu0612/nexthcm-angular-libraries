import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeManagement, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-management-form',
  templateUrl: './management-form.component.html',
  styleUrls: ['./management-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ManagementFormComponent {
  form = this.fb.group({} as EmployeeManagement);
  model = { attachments: [{}] } as EmployeeManagement;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'subLeader',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.subLeader`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSubLeader`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'directManager',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.directManager`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterDirectManager`,
                textfieldLabelOutside: true,
                required: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'upperManager',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.upperManager`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterUpperManager`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'hod',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.hod`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterHod`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          className: 'col-span-2',
          fieldGroup: [
            {
              key: 'hrbp',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.hrbp`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterHrbp`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'pjc',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.pjc`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterPjc`,
                textfieldLabelOutside: true,
              },
            },
          ],
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
