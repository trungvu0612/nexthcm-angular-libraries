import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeAttachment, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';
import { convertAttachment } from '../../utils/convert-attachment';

@Component({
  selector: 'hcm-attachment-form',
  templateUrl: './attachment-form.component.html',
  styleUrls: ['./attachment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AttachmentFormComponent {
  form = this.fb.group({} as EmployeeAttachment);
  model = { attachments: [{}] } as EmployeeAttachment;
  fields: FormlyFieldConfig[] = [
    {
      key: 'attachments',
      type: 'repeat',
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
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'ATTACHMENT')
    .pipe(
      tap((res) => {
        const data = { ...res, attachments: res.attachmentFiles?.map((path) => convertAttachment(path)) || [{}] };

        return (this.model = { ...this.model, ...data });
      })
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly filesService: FilesService,
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: EmployeeAttachment = { ...this.form.value };

      formModel.attachmentFiles = formModel.attachments?.map((attachment) => attachment.path).filter(isPresent) || [];
      delete formModel.attachments;
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeAttachment>(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessfully'));
    }
  }
}
