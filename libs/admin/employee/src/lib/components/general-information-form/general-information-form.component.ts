import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadFileService } from '@nexthcm/ui';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EmployeeGeneralInformation } from '../../models/employee';

@Component({
  selector: 'hcm-general-information-form',
  templateUrl: './general-information-form.component.html',
  styleUrls: ['./general-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationFormComponent {
  form = this.fb.group<EmployeeGeneralInformation>({});
  model: EmployeeGeneralInformation = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'cifNumber',
              className: 'tui-form__row block',
              type: 'input-number',
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
              key: 'name',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                translate: true,
                label: 'name',
                required: true,
                textfieldLabelOutside: true,
                labelClassName: 'font-semibold',
                placeholder: 'inputName',
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
              key: 'thumbnail',
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
              templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
              expressionProperties: {
                'templateOptions.label': this.translocoService.selectTranslate('status'),
                'templateOptions.description': this.form?.valueChanges.pipe(
                  startWith(null),
                  map((value) => value?.status),
                  distinctUntilChanged(),
                  switchMap((status) =>
                    this.translocoService.selectTranslate(`STATUS.${status ? 'active' : 'inactive'}`)
                  )
                ),
              },
            },
          ],
        },
        {
          fieldGroup: [
            {
              key: 'organization',
              className: 'tui-form__row block',
              type: 'select-search',
              templateOptions: {
                translate: true,
                label: 'organization',
                labelClassName: 'font-semibold',
                placeholder: 'selectOrganization',
                serverRequest: () => of([]),
                labelProp: 'name',
                virtualScroll: true,
                textfieldLabelOutside: true,
                useOptionTemplate: true,
                useLabelTemplate: true,
                required: true,
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
              },
              expressionProperties: {
                'templateOptions.typeToSearchText': this.translocoService.selectTranslate('typeToSearchOrganizations'),
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
                placeholder: 'selectRoles',
                options: [],
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                placeholder: 'selectJobTitle',
                options: [],
              },
              validation: {
                messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') },
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
                placeholder: 'selectJobLevel',
                options: [],
              },
            },
            {
              key: 'directReport',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                required: true,
                label: 'directReport',
                labelClassName: 'font-semibold',
                placeholder: 'selectDirectReport',
                options: [],
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

  constructor(
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private translocoService: TranslocoService
  ) {}

  onSubmit(): void {
    console.log(JSON.stringify(this.form.value));
  }
}
