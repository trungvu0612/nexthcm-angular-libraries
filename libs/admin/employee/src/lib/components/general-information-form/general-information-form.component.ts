import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeGeneralInformation, EmployeesService, UploadFileService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationFormComponent {
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<EmployeeGeneralInformation>;
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();
  readonly userContext!: { $implicit: EmployeeGeneralInformation };
  form: FormGroup<EmployeeGeneralInformation> = this.fb.group({} as EmployeeGeneralInformation);
  model = {} as EmployeeGeneralInformation;
  options: FormlyFormOptions = {
    formState: {
      editMode: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'cif',
              className: 'mt-5 block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'cifNumber',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'enterCifNumber',
                readonly: true,
              },
              hideExpression: `!formState.editMode`,
            },
            {
              key: 'firstName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'firstName',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'enterFirstName',
              },
              expressionProperties: {
                'templateOptions.readonly': '(model.registerType === "LDAP")',
              },
            },
            {
              key: 'lastName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'lastName',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'enterLastName',
              },
              expressionProperties: {
                'templateOptions.readonly': '(model.registerType === "LDAP")',
              },
            },
            {
              key: 'otherName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'otherName',
                placeholder: 'enterOtherName',
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
              },
            },
            {
              key: 'image',
              className: 'tui-form__row block',
              type: 'upload-file',
              templateOptions: {
                required: true,
                translate: true,
                accept: 'image/*',
                label: 'image',
                labelClassName: 'font-semibold',
                previewImage: true,
                serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'employee'),
              },
              expressionProperties: {
                'templateOptions.linkText': this.translocoService.selectTranslate('chooseImage'),
                'templateOptions.labelText': this.translocoService.selectTranslate('dragHere'),
              },
            },
            {
              key: 'status',
              className: 'tui-form__row block',
              type: 'toggle',
              defaultValue: true,
              templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
              expressionProperties: {
                'templateOptions.label': this.translocoService.selectTranslate('status'),
                'templateOptions.description': this.form?.valueChanges.pipe(
                  startWith(null),
                  map((value) => value?.status),
                  distinctUntilChanged(),
                  switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
                ),
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'organization',
              className: 'mt-5 block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'department',
                labelClassName: 'font-semibold',
                placeholder: 'chooseDepartment',
                required: true,
                options: this.adminEmployeeService.select('organizations'),
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'roles',
              className: 'tui-form__row block',
              type: 'multi-select',
              templateOptions: {
                translate: true,
                required: true,
                label: 'roles',
                labelClassName: 'font-semibold',
                placeholder: 'chooseRoles',
                options: this.adminEmployeeService.select('roles'),
                matcherBy: 'id',
              },
            },
            {
              key: 'jobTitle',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                required: true,
                label: 'jobTitle',
                labelClassName: 'font-semibold',
                placeholder: 'chooseJobTitle',
                options: this.adminEmployeeService.select('jobTitles'),
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'jobLevel',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'jobLevel',
                labelClassName: 'font-semibold',
                placeholder: 'chooseJobLevel',
                options: this.adminEmployeeService.select('jobLevels'),
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'directReport',
              className: 'tui-form__row block',
              type: 'user-combo-box',
              templateOptions: {
                translate: true,
                required: true,
                label: 'directReport',
                labelClassName: 'font-semibold',
                placeholder: 'chooseDirectReport',
              },
            },
          ],
        },
      ],
    },
  ];
  private readonly request$ = this.activatedRoute.snapshot.params.employeeId
    ? this.employeesService
        .getEmployeeGeneralInformation(this.activatedRoute.snapshot.params.employeeId)
        .pipe(tap((data) => (this.model = { ...this.model, ...data })))
    : of({});
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private translocoService: TranslocoService,
    private employeesService: EmployeesService,
    private adminEmployeeService: AdminEmployeeService,
    private activatedRoute: ActivatedRoute
  ) {}

  @Input()
  set editMode(value: unknown) {
    this.options.formState.editMode = coerceBooleanProperty(value);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      formModel.status = formModel.status ? 1 : 0;
      this.submitted.emit(formModel);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
