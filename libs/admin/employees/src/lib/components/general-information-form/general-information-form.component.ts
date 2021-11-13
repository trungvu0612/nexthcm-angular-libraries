import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cacheable } from '@datorama/akita';
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
import { FormBuilder } from '@ng-stack/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeGeneralQuery, EmployeeGeneralStore, EmployeeQuery } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationFormComponent {
  @Input() submitLoading = false;
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();
  model = {} as EmployeeGeneralInformation;
  form = this.fb.group<EmployeeGeneralInformation>(this.model);
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
                label: `${TRANSLATION_SCOPE}.cifNumber`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterCifNumber`,
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
                label: `${TRANSLATION_SCOPE}.firstName`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterFirstName`,
              },
              expressionProperties: {
                className: (model, formState) => (formState.editMode ? 'tui-form__row block' : ''),
              },
            },
            {
              key: 'lastName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.lastName`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.enterLastName`,
              },
            },
            {
              key: 'otherName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.otherName`,
                placeholder: `${TRANSLATION_SCOPE}.enterOtherName`,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
              },
            },
            {
              key: 'image',
              className: 'tui-form__row block',
              type: 'upload-file',
              templateOptions: {
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
                  TRANSLATION_SCOPE
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
                label: `${TRANSLATION_SCOPE}.directReport`,
                labelClassName: 'font-semibold',
                placeholder: `${TRANSLATION_SCOPE}.chooseDirectReport`,
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
  private readonly request$ = this.employeeQuery
    ? this.employeeGeneralQuery.select().pipe(tap((data) => (this.model = { ...this.model, ...data })))
    : of({} as EmployeeGeneralInformation);
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
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
    @Optional() private readonly employeeQuery: EmployeeQuery,
    @Optional() private readonly employeeGeneralStore: EmployeeGeneralStore,
    @Optional() private readonly employeeGeneralQuery: EmployeeGeneralQuery,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
    actions.dispatch(loadJobLevels());
    actions.dispatch(loadRoles());

    if (employeeQuery) {
      cacheable(
        this.employeeGeneralStore,
        this.employeesService.getEmployeeGeneralInformation(employeeQuery.getValue().id).pipe(
          tap((res) => {
            this.employeeGeneralStore.update(res);
            this.employeeGeneralStore.setHasCache(true);
          })
        )
      ).subscribe();
    }
  }

  private _hideCancelButton = false;

  get hideCancelButton(): boolean {
    return this._hideCancelButton;
  }

  @Input()
  set hideCancelButton(value: unknown) {
    this._hideCancelButton = coerceBooleanProperty(value);
  }

  @Input()
  set editMode(value: unknown) {
    this.options.formState.editMode = coerceBooleanProperty(value);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value } as EmployeeGeneralInformation;

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.submitted.emit(formModel);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
