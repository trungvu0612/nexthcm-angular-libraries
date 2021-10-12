import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  CommonStatus,
  EmployeeGeneralInformation,
  EmployeesService,
  JobLevelsQuery,
  JobTitlesQuery,
  loadJobLevels,
  loadJobTitles,
  loadRoles,
  RolesQuery,
  UploadFileService,
} from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { of } from 'rxjs';
import { catchError, map, share, startWith, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationFormComponent {
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();
  form = this.fb.group<EmployeeGeneralInformation>({} as EmployeeGeneralInformation);
  model = {} as EmployeeGeneralInformation;
  options: FormlyFormOptions = {
    formState: {
      editMode: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'cif',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'cifNumber',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'enterCifNumber',
                readonly: true,
                translocoScope: this.scope,
              },
              hideExpression: `!formState.editMode`,
              expressionProperties: {
                className: (model, formState) => (formState.editMode ? 'tui-form__row block' : 'hidden'),
              },
            },
            {
              key: 'firstName',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'firstName',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'enterFirstName',
                translocoScope: this.scope,
              },
              expressionProperties: {
                'templateOptions.readonly': 'model.registerType === "LDAP"',
                className: (model, formState) => (formState.editMode ? 'tui-form__row block' : ''),
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
                translocoScope: this.scope,
              },
              expressionProperties: {
                'templateOptions.readonly': 'model.registerType === "LDAP"',
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
                translocoScope: this.scope,
              },
            },
            {
              key: 'image',
              className: 'tui-form__row block',
              type: 'upload-file',
              templateOptions: {
                required: true,
                accept: 'image/*',
                labelClassName: 'font-semibold',
                previewImage: true,
                serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'employee'),
              },
              expressionProperties: {
                'templateOptions.linkText': this.translocoService.selectTranslate('chooseImage'),
                'templateOptions.labelText': this.translocoService.selectTranslate('dragHere'),
                'templateOptions.label': this.translocoService.selectTranslate('image'),
              },
            },
            {
              key: 'statusBoolean',
              className: 'tui-form__row block',
              type: 'status-toggle',
              defaultValue: true,
              templateOptions: {
                translate: true,
                label: 'status',
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'organization',
              className: 'tui-form__row block',
              type: 'select-org-tree',
              templateOptions: {
                translate: true,
                label: 'department',
                labelClassName: 'font-semibold',
                placeholder: 'chooseDepartment',
                required: true,
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
                options: this.rolesQuery.selectAll(),
                matcherBy: 'id',
                disabledItemHandler: (item: BaseObject) => item.isDisable,
              },
            },
            {
              key: 'jobTitle',
              className: 'tui-form__row block',
              type: 'combo-box',
              templateOptions: {
                translate: true,
                label: 'jobTitle',
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: 'searchJobTitles',
                required: true,
                serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
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
                options: this.jobLevelsQuery.selectAll(),
                labelProp: 'name',
                matcherBy: 'id',
              },
            },
            {
              key: 'syncLDAPDirectReport',
              className: 'tui-form__row block',
              type: 'toggle',
              templateOptions: { textfieldLabelOutside: true, size: 'l' },
              expressionProperties: {
                'templateOptions.description': this.translocoService.selectTranslate(
                  'syncLDAPDirectReport',
                  {},
                  this.scope
                ),
              },
              hideExpression: 'model.registerType !== "LDAP"',
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
                translocoScope: this.scope,
              },
              hideExpression: 'model.syncLDAPDirectReport',
            },
          ],
        },
      ],
    },
    { key: 'id' },
    { key: 'registerType' },
  ];
  private readonly request$ = this.activatedRoute.snapshot.params.employeeId
    ? this.employeesService.getEmployeeGeneralInformation(this.activatedRoute.snapshot.params.employeeId).pipe(
        tap((data) => (this.model = { ...this.model, ...data })),
        startWith(null),
        share()
      )
    : of({} as EmployeeGeneralInformation);
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private readonly employeesService: EmployeesService,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly jobLevelsQuery: JobLevelsQuery,
    private readonly rolesQuery: RolesQuery,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
    actions.dispatch(loadJobLevels());
    actions.dispatch(loadRoles());
  }

  @Input()
  set editMode(value: unknown) {
    this.options.formState.editMode = coerceBooleanProperty(value);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.submitted.emit(formModel);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
