import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadFileService } from '@nexthcm/ui';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { BaseItem, EmployeeGeneralInformation } from '../../models';
import { AdminEmployeeService } from '../../services/admin-employee.service';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class GeneralInformationFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<EmployeeGeneralInformation>();
  @Output() cancel = new EventEmitter();

  form = this.fb.group<EmployeeGeneralInformation>({});
  model: EmployeeGeneralInformation = {};
  fields!: FormlyFieldConfig[];
  employeeId: string;

  constructor(
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private translocoService: TranslocoService,
    private adminEmployeeService: AdminEmployeeService,
    private activatedRoute: ActivatedRoute,
    private destroy$: TuiDestroyService
  ) {
    this.employeeId = this.activatedRoute.snapshot.params.employeeId;
  }

  private _editMode?: boolean;

  @Input()
  set editMode(value: unknown) {
    this._editMode = coerceBooleanProperty(value);
  }

  ngOnInit(): void {
    this.fields = [
      {
        fieldGroupClassName: 'grid grid-cols-2 gap-4',
        fieldGroup: [
          {
            fieldGroup: [
              {
                key: 'cif',
                className: 'mt-5 block',
                type: 'input-number',
                hide: !this._editMode,
                templateOptions: {
                  translate: true,
                  label: 'cifNumber',
                  required: true,
                  textfieldLabelOutside: true,
                  labelClassName: 'font-semibold',
                  placeholder: 'enterCifNumber',
                },
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
                },
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
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                type: 'object-select',
                templateOptions: {
                  translate: true,
                  label: 'organization',
                  labelClassName: 'font-semibold',
                  placeholder: 'chooseOrganization',
                  required: true,
                  options: this.adminEmployeeService.select('organizations'),
                  labelProp: 'name',
                  compareWith: (item1: BaseItem, item2: BaseItem) => item1.id === item2.id,
                },
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
                },
              },
              {
                key: 'roles',
                className: 'tui-form__row block',
                type: 'object-select',
                templateOptions: {
                  translate: true,
                  required: true,
                  label: 'roles',
                  labelClassName: 'font-semibold',
                  placeholder: 'chooseRoles',
                  options: this.adminEmployeeService.select('roles'),
                  labelProp: 'name',
                  multiple: true,
                  compareWith: (item1: BaseItem, item2: BaseItem) => item1.id === item2.id,
                },
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
                },
              },
              {
                key: 'jobTitle',
                className: 'tui-form__row block',
                type: 'object-select',
                templateOptions: {
                  translate: true,
                  required: true,
                  label: 'jobTitle',
                  labelClassName: 'font-semibold',
                  placeholder: 'chooseJobTitle',
                  options: this.adminEmployeeService.select('jobTitles'),
                  labelProp: 'name',
                  compareWith: (item1: BaseItem, item2: BaseItem) => item1.id === item2.id,
                },
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
                },
              },
              {
                key: 'jobLevel',
                className: 'tui-form__row block',
                type: 'object-select',
                templateOptions: {
                  translate: true,
                  label: 'jobLevel',
                  labelClassName: 'font-semibold',
                  placeholder: 'chooseJobLevel',
                  options: this.adminEmployeeService.select('jobLevels'),
                  labelProp: 'name',
                  compareWith: (item1: BaseItem, item2: BaseItem) => item1.id === item2.id,
                },
              },
              {
                key: 'directReport',
                className: 'tui-form__row block',
                type: 'object-select',
                templateOptions: {
                  translate: true,
                  required: true,
                  label: 'directReport',
                  labelClassName: 'font-semibold',
                  placeholder: 'chooseDirectReport',
                  options: this.adminEmployeeService.select('users'),
                  labelProp: 'name',
                  compareWith: (item1: BaseItem, item2: BaseItem) => item1.id === item2.id,
                },
                validation: {
                  messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
                },
              },
            ],
          },
        ],
      },
    ];
    if (this.employeeId) {
      this.adminEmployeeService
        .getEmployeeGeneralInformation(this.employeeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => (this.model = { ...this.model, ...res.data }));
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = this.form.value;
      formModel.status = formModel.status ? 1 : 0;
      this.submitted.emit(formModel);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
