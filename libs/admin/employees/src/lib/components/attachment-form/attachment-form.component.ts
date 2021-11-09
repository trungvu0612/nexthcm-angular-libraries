import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { cacheable } from '@datorama/akita';
import { EmployeeAttachment, EmployeesService, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeAttachmentQuery, EmployeeAttachmentStore, EmployeeQuery } from '../../state';
import { convertAttachment } from '../../utils/convert-attachment';

@Component({
  selector: 'hcm-attachment-form',
  templateUrl: './attachment-form.component.html',
  styleUrls: ['./attachment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AttachmentFormComponent {
  form: FormGroup<EmployeeAttachment> = this.fb.group({} as EmployeeAttachment);
  model = { attachments: [{}] } as EmployeeAttachment;
  fields: FormlyFieldConfig[] = [
    {
      key: 'attachments',
      type: 'repeat',
      templateOptions: {
        translate: true,
        label: 'attachmentFiles',
        translocoScope: this.scope,
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
              serverRequest: (file: File) => this.uploadFileService.uploadFile('employee', file, true),
            },
            expressionProperties: {
              'templateOptions.linkText': this.translocoService.selectTranslate('chooseFile'),
              'templateOptions.labelText': this.translocoService.selectTranslate('dragHere'),
              'templateOptions.onUploadedFile': (model, formState, field) => (value: string) =>
                (
                  (field?.parent?.form as unknown as FormArray)?.at(field?.parent?.key as number) as FormGroup
                ).controls?.path?.setValue(value),
            },
          },
          { key: 'path', type: 'download-button' },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeeAttachmentQuery
    .select()
    .pipe(tap((data) => (this.model = { ...this.model, ...data })));
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly employeeAttachmentStore: EmployeeAttachmentStore,
    private readonly employeeAttachmentQuery: EmployeeAttachmentQuery,
    employeeQuery: EmployeeQuery
  ) {
    cacheable(
      this.employeeAttachmentStore,
      this.employeesService.getEmployeeInformation(employeeQuery.getValue().id, 'ATTACHMENT').pipe(
        tap((res) => {
          const data = { ...res, attachments: res.attachmentFiles?.map((path) => convertAttachment(path)) || [{}] };

          this.employeeAttachmentStore.update(data);
          this.employeeAttachmentStore.setHasCache(true);
        })
      )
    ).subscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.attachmentFiles = formModel.attachments?.map((attachment) => attachment.path).filter(isPresent) || [];
      delete formModel.attachments;
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeAttachment>(formModel)
        .pipe(
          tap(() => this.employeeAttachmentStore.update(this.form.value)),
          takeUntil(this.destroy$)
        )
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }
}
