import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeFamilyBook, EmployeesService, FilesService, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-family-book-form',
  templateUrl: './family-book-form.component.html',
  styleUrls: ['./family-book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FamilyBookFormComponent {
  form = this.fb.group({} as EmployeeFamilyBook);
  model = { attachments: [{}] } as EmployeeFamilyBook;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          key: 'familyBookNumber',
          className: 'tui-form__row block',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.familyBookNumber`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterFamilyBookNumber`,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          key: 'familyBookOwnerName',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.familyBookOwnerName`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterFamilyBookOwnerName`,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'familyBookOwnerBirthday',
          type: 'input-date',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.familyBookOwnerBirthday`,
            labelClassName: 'font-semibold',
            textfieldLabelOutside: true,
            placeholder: `${this.translocoScope.scope}.enterFamilyBookOwnerBirthday`,
          },
        },
        {
          key: 'familyBookOwnerId',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.familyBookOwnerId`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterFamilyBookOwnerId`,
            textfieldLabelOutside: true,
            required: true,
          },
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'ownerGender',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.ownerGender`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterOwnerGender`,
            textfieldLabelOutside: true,
          },
        },
        {
          key: 'relationshipOwnerEmployee',
          type: 'input',
          templateOptions: {
            translate: true,
            label: `${this.translocoScope.scope}.relationshipOwnerEmployee`,
            labelClassName: 'font-semibold',
            placeholder: `${this.translocoScope.scope}.enterRelationshipOwnerEmployee`,
            textfieldLabelOutside: true,
          },
        },
      ],
    },
    {
      className: 'tui-form__row block',
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
    .getEmployeeInformation(this.activatedRoute.snapshot.queryParams['id'], 'FAMILY_BOOK')
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
