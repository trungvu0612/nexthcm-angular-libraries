import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeePIT, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-pit-form',
  templateUrl: './pit-form.component.html',
  styleUrls: ['./pit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class PitFormComponent {
  form = this.fb.group({} as EmployeePIT);
  model = { attachments: [{}] } as EmployeePIT;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'taxCode',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.taxCode`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterTaxCode`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'noOfDependant',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.noOfDependant`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterNoOfDependant`,
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
