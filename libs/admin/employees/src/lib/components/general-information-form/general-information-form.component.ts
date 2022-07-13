import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BaseObject,
  BaseUser,
  CommonStatus,
  EmployeeGeneralInformation,
  EmployeesService,
  FilesService,
  JobLevelsService,
  JobTitlesService,
  RolesService,
  Supervisor,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import flatten from 'just-flatten-it';
import { of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class GeneralInformationFormComponent implements OnInit {
  @Input() submitLoading = false;
  @Input() submitPermission: string | string[] = [];
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();
  form = this.fb.group({});
  model = { userMultipleReportMethod: [{}] as Supervisor[], attachments: [{}] } as EmployeeGeneralInformation;
  options: FormlyFormOptions = {
    formState: {
      editMode: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-6 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
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
                required: true,
              },
            },
          ],
        },
        {
          className: 'col-span-3',
          fieldGroup: [
            {
              key: 'vCode',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.vCode`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterVCode`,
                textfieldLabelOutside: true,
                disabled: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'site',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.site`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSite`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'cif',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `cifNumber`,
                disabled: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: `enterCifNumber`,
              },
              hideExpression: `!formState.editMode`,
              expressionProperties: {
                className: (model, formState) => (formState.editMode ? 'tui-form__row block' : 'hidden'),
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
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
            },
          ],
        },
        {
          fieldGroup: [
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
          ],
        },
        {
          fieldGroup: [
            {
              key: 'fullNameInVietnamese',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: this.translocoScope.scope + '.vietnameseFullName',
                placeholder: this.translocoScope.scope + '.enterVietnameseFullName',
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-6 gap-4',
      fieldGroup: [
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
          ],
        },
        {
          fieldGroup: [
            {
              key: 'teamSection',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.teamSection`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterTeamSection`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
        {
          className: 'col-span-2',
          fieldGroup: [
            {
              key: 'sector',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.sector`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSector`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
        {
          className: 'col-span-2',
          fieldGroup: [
            {
              key: 'costCenter',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.costCenter`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterCostCenter`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'jobTitle',
              className: 'tui-form__row block',
              type: 'combo-box',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.enJobTitle`,
                labelClassName: 'font-semibold',
                textfieldLabelOutside: true,
                placeholder: `${this.translocoScope.scope}.enterEnJobTitle`,
                required: true,
                serverRequest: (searchQuery: string) => this.jobTitlesService.searchJobTitles(searchQuery),
                matcherBy: 'id',
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'vnJobTitle',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.vnJobTitle`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterVnJobTitle`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'workingPlace',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.workingPlace`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterWorkingPlace`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'accountCustomer',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.accountCustomer`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterAccountCustomer`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'RCS',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.RCS`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterRCS`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'staffCategory',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.staffCategory`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterStaffCategory`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
      ],
    },
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-4 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'seniorityDate',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.seniorityDate`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterSeniorityDate`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'BVTime',
              type: 'input',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.BVTime`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterBVTime`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'startWorkingDay',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.startWorkingDay`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterStartWorkingDay`,
                textfieldLabelOutside: true,
                // required: true,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'lastWorkingDay',
              type: 'input-date',
              templateOptions: {
                translate: true,
                label: `${this.translocoScope.scope}.lastWorkingDay`,
                labelClassName: 'font-semibold',
                placeholder: `${this.translocoScope.scope}.enterLastWorkingDay`,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },

    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
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
                options: this.rolesService.roles$,
                matcherBy: 'id',
                disabledItemHandler: (item: BaseObject) => item.isDisable,
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'image',
              className: 'tui-form__row block',
              type: 'upload-file',
              templateOptions: {
                accept: 'image/*',
                translate: true,
                label: 'image',
                labelClassName: 'font-semibold',
                previewImage: true,
                serverRequest: this.filesService.uploadFile.bind(this.filesService, 'employee'),
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
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
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
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'jobLevel',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'jobLevel',
                labelClassName: 'font-semibold',
                placeholder: 'chooseJobLevel',
                options: this.jobLevelsService.jobLevels$,
                labelProp: 'name',
                matcherBy: 'id',
              },
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
              label: 'supervisors',
              placeholder: 'searchSupervisors',
              labelProp: 'name',
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
  private readonly request$ = this.employeeId
    ? this.state.select().pipe(
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
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly state: RxState<EmployeeGeneralInformation>,
    private readonly fb: FormBuilder,
    private readonly filesService: FilesService,
    private readonly translocoService: TranslocoService,
    private readonly employeesService: EmployeesService,
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly jobTitlesService: JobTitlesService,
    private readonly jobLevelsService: JobLevelsService,
    private readonly rolesService: RolesService,
    private readonly destroy$: TuiDestroyService
  ) {
    jobTitlesService.doLoadJobTitles();
    jobLevelsService.doLoadJobLevels();
    rolesService.doLoadRoles();
    employeesService.doLoadSupervisorTypes();
    state.connect(
      this.activatedRoute.queryParamMap.pipe(
        map((map) => map.get('id')),
        filter(isPresent),
        switchMap((employeeId) => this.employeesService.getEmployeeGeneralInformation(employeeId))
      )
    );
  }

  get employeeId(): string | undefined {
    return this.activatedRoute.snapshot.queryParams['id'];
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
    this.employeesService.supervisorTypes$.pipe(takeUntil(this.destroy$)).subscribe((types) => {
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
