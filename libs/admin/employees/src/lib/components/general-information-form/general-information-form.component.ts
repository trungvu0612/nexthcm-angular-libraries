import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { cacheable } from '@datorama/akita';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  BaseUser,
  CommonStatus,
  EmployeeGeneralInformation,
  EmployeesService,
  JobLevelsQuery,
  JobTitlesQuery,
  loadJobLevels,
  loadJobTitles,
  loadRoles,
  RolesQuery,
  Supervisor,
  UploadFileService,
} from '@nexthcm/cdk';
import { FormGroup } from '@ng-stack/forms';
import { AbstractControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import flatten from 'just-flatten-it';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';
import { EmployeeGeneralQuery, EmployeeGeneralStore, EmployeeQuery } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class GeneralInformationFormComponent implements OnInit {
  @Input() submitLoading = false;
  @Input() submitPermission: string | string[] = [];
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();
  form = this.fb.group({}) as FormGroup<EmployeeGeneralInformation>;
  model = { userMultipleReportMethod: [{}] as Supervisor[] } as EmployeeGeneralInformation;
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
                label: `cifNumber`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `enterCifNumber`,
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
                label: `firstName`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `enterFirstName`,
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
                label: `lastName`,
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `enterLastName`,
              },
            },
            {
              key: 'otherName',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `otherName`,
                placeholder: `enterOtherName`,
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
                label: `directReport`,
                labelClassName: 'font-semibold',
                placeholder: `chooseDirectReport`,
              },
              asyncValidators: {
                circular: {
                  expression: (control: AbstractControl<string>) =>
                    !control.valueChanges || control.pristine || !control.value
                      ? of(true)
                      : control.valueChanges.pipe(
                          take(1),
                          switchMap((user: BaseObject) =>
                            this.employeeGeneralQuery.getValue().directReport?.id === user?.id
                              ? of(true)
                              : this.adminEmployeesService
                                  .checkCircularDirectReports(this.model.id, user.id)
                                  .pipe(map((res) => !res.isCircular))
                          ),
                          tap(() => control.markAsTouched())
                        ),
                  message: () => this.translocoService.selectTranslate('VALIDATION.circularDirectReport'),
                },
              },
              hideExpression: 'model.syncLDAPDirectReport',
            },
          ],
        },
      ],
    },
    {
      key: 'userMultipleReportMethod',
      className: 'tui-form__row block',
      type: 'repeat',
      templateOptions: {
        translate: true,
        label: `supervisorList`,
        hideAddButton: true,
        hideRemoveButton: true,
      },
      fieldArray: {
        fieldGroupClassName: 'grid grid-cols-4 gap-4',
        fieldGroup: [
          {
            key: 'method',
            type: 'combo-box',
            templateOptions: {
              translate: true,
              label: `supervisorType`,
              options: [],
              labelProp: 'name',
              matcherBy: 'id',
              readonly: true,
              strict: false,
              textfieldLabelOutside: true,
            },
          },
          {
            key: 'userReports',
            type: 'multi-select-search',
            className: 'col-span-3',
            templateOptions: {
              translate: true,
              label: `supervisors`,
              placeholder: `searchSupervisors`,
              labelProp: 'name',
              matcherBy: 'id',
              textfieldLabelOutside: true,
              serverRequest: (searchQuery: string) =>
                this.employeesService.searchEmployees(searchQuery).pipe(
                  map((employees) => {
                    const selectedSupervisors = flatten(
                      this.model.userMultipleReportMethod.map((item) => item.userReports)
                    );

                    if (this.model.directReport) {
                      selectedSupervisors.push(this.model.directReport as BaseUser);
                    }

                    return employees.filter(
                      (employee) =>
                        !selectedSupervisors.find((supervisor) => supervisor.id === employee.id) &&
                        employee.id !== this.model.id
                    );
                  })
                ),
            },
          },
        ],
      },
    },
    { key: 'id' },
    { key: 'registerType' },
  ];
  private _initialSupervisors: Supervisor[] = [];
  private readonly request$ = this.employeeQuery
    ? this.employeeGeneralQuery.select().pipe(
        tap(
          (data) =>
            (this.model = {
              ...this.model,
              ...data,
              userMultipleReportMethod: this.createSupervisorList(data.userMultipleReportMethod),
              statusBoolean: data.status === CommonStatus.active,
            })
        )
      )
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
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly jobLevelsQuery: JobLevelsQuery,
    private readonly rolesQuery: RolesQuery,
    private readonly destroy$: TuiDestroyService,
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

  ngOnInit(): void {
    this.employeesService
      .getSupervisorTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((types) => {
        this._initialSupervisors = types.map((type) => ({
          method: type,
          userReports: [],
        }));
        this.model.userMultipleReportMethod = this.createSupervisorList(this.model.userMultipleReportMethod);
        this.model = { ...this.model };
      });
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

  private createSupervisorList(data: Supervisor[]): Supervisor[] {
    if (!this._initialSupervisors?.length) {
      return data;
    }

    const result: Supervisor[] = [];

    this._initialSupervisors.forEach((item) => {
      const supervisor = data.find((supervisor) => supervisor.method?.id === item.method.id);

      if (supervisor) {
        result.push(supervisor);
      } else {
        result.push(item);
      }
    });

    return result;
  }
}
