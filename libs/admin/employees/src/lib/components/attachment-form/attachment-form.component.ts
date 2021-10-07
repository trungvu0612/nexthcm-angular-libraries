import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeAttachment, EmployeesService, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, takeUntil, tap } from 'rxjs/operators';
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
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'ATTACHMENT')
    .pipe(
      tap((data) => {
        this.model = {
          ...this.model,
          ...data,
          attachments: data.attachmentFiles?.map((path) => convertAttachment(path)) || [{}],
          employeeId: this.activatedRoute.snapshot.params.employeeId,
          type: 'ATTACHMENT',
        };
      }),
      startWith(null),
      share()
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.attachmentFiles = formModel.attachments?.map((attachment) => attachment.path).filter(isPresent) || [];
      delete formModel.attachments;
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeAttachment>(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
