import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeResignationLeave, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-resignation-leave-form',
  templateUrl: './resignation-leave-form.component.html',
  styleUrls: ['./resignation-leave-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ResignationLeaveFormComponent {
  form = this.fb.group({} as EmployeeResignationLeave);
  model = { attachments: [{}] } as EmployeeResignationLeave;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'resignationReasons',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.resignationReasons`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterResignationReasons`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'startDateOfUnpaidLeave',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.startDateOfUnpaidLeave`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterStartDateOfUnpaidLeave`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'typeOfUnpaidLeave',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.typeOfUnpaidLeave`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterTypeOfUnpaidLeave`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'noOfTerminationDecision',
              type: 'input',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.noOfTerminationDecision`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterNoOfTerminationDecision`,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'backdatedAfterUnpaidLeave',
              type: 'input-date',
              className: 'tui-form__row block',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.backdatedAfterUnpaidLeave`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterBackdatedAfterUnpaidLeave`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-1 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'remarkOfUnpaidLeave',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.remarkOfUnpaidLeave`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterRemarkOfUnpaidLeave`,
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
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'RESIGNATION_LEAVE')
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
