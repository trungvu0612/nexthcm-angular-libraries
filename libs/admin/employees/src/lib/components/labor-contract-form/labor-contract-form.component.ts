import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeLaborContract, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-labor-contract-form',
  templateUrl: './labor-contract-form.component.html',
  styleUrls: ['./labor-contract-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class LaborContractFormComponent {
  form = this.fb.group({} as EmployeeLaborContract);
  model = { attachments: [{}] } as EmployeeLaborContract;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'probationInternAgreementNo',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.probationInternAgreementNo`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterProbationInternAgreementNo`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'laborContractNo',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.laborContractNo`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterLaborContractNo`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'probationStartDate',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.probationStartDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterProbationStartDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'firstLaborContractStartDate',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.firstLaborContractStartDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterFirstLaborContractStartDate`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'probationEndDate',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.probationEndDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterProbationEndDate`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'firstLaborContractEndDate',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.firstLaborContractEndDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterFirstLaborContractEndDate`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'indefiniteTermLaborContractStartDate',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.indefiniteTermLaborContractStartDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterIndefiniteTermLaborContractStartDate`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'currentTypeOfContract',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.currentTypeOfContract`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterCurrentTypeOfContract`,
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
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'LABOR_CONTRACT')
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
