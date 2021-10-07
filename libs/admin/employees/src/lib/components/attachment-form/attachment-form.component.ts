import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeAttachment, EmployeesService, PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-attachment-form',
  templateUrl: './attachment-form.component.html',
  styleUrls: ['./attachment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AttachmentFormComponent {
  form: FormGroup<EmployeeAttachment> = this.fb.group({} as EmployeeAttachment);
  model = {} as EmployeeAttachment;
  fields: FormlyFieldConfig[] = [
    {
      key: 'attachmentFiles',
      className: 'tui-form__row block',
      type: 'upload-file',
      templateOptions: {
        required: true,
        translate: true,
        label: 'attachmentFiles',
        labelClassName: 'font-semibold',
        previewImage: true,
        serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'employee'),
      },
      expressionProperties: {
        'templateOptions.linkText': this.translocoService.selectTranslate('chooseFiles'),
        'templateOptions.labelText': this.translocoService.selectTranslate('dragHere'),
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'ATTACHMENT')
    .pipe(
      tap(
        (data) =>
          (this.model = {
            ...this.model,
            ...data,
            employeeId: this.activatedRoute.snapshot.params.employeeId,
            type: 'ATTACHMENT',
          })
      ),
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
    private readonly promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeAttachment>(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
