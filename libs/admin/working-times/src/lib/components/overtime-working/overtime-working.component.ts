import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-overtime-working',
  templateUrl: './overtime-working.component.html',
  styleUrls: ['./overtime-working.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeWorkingComponent {
  model: any = {};
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'office',
      type: 'select',
      templateOptions: {
        options: [
          { value: 1, label: 'Van Phuc' },
          { value: 2, label: 'Copac' },
        ],
        label: 'Office',
        labelClassName: 'font-semibold',
      },
    },
    {
      expressionProperties: {
        template: this.translocoService
          .selectTranslate<string>('applyFor')
          .pipe(map((result) => `<div class="font-semibold mt-5">${result}</div>`)),
      },
    },
    {
      className: 'tui-form__row block',
      key: 'applyFor', // TODO: need change
      fieldGroup: [
        {
          className: 'block mb-5',
          key: 'default',
          type: 'checkbox-labeled',
          defaultValue: false,
          templateOptions: {
            translate: true,
            label: 'Default',
            size: 'l',
            disabled: true,
          },
        },
        {
          fieldGroupClassName: 'grid grid-cols-7 gap-2',
          fieldGroup: [
            {
              key: 'monday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Monday',
                size: 'l',
              },
            },
            {
              key: 'tuesday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Tuesday',
                size: 'l',
              },
            },
            {
              key: 'wednesday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Wednesday',
                size: 'l',
              },
            },
            {
              key: 'thursday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Thursday',
                size: 'l',
              },
            },
            {
              key: 'friday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Friday',
                size: 'l',
              },
            },
            {
              key: 'saturday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Saturday',
                size: 'l',
              },
            },
            {
              key: 'sunday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Sunday',
                size: 'l',
              },
            },
          ],
        },
      ],
    },
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'grid grid-cols-5 gap-4',
          fieldGroup: [
            {
              className: 'block my-5 text-xl',
              key: 'check-out',
              type: 'input',
              defaultValue: '18:00',
              templateOptions: {
                placeholder: 'Check out',
                disabled: true,
              },
            },
            {
              className: 'block my-5 small-field',
              key: 'otTime',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'OT Time',
                required: true,
              },
            },
            {
              className: 'block my-5 small-field',
              key: 'hourMin',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Hour Min',
                required: true,
              },
            },
            {
              className: 'block my-5 small-field',
              key: 'minuteMin',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Minute Min',
                required: true,
              },
            },
            {
              key: 'status',
              className: 'tui-form__row block',
              type: 'toggle',
              templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
              expressionProperties: {
                'templateOptions.label': of('Use FingerPrint'),
              },
            },
          ],
        },
      ],
    },
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'grid grid-cols-5 gap-4',
          fieldGroup: [
            {
              className: 'block my-5 small-field',
              key: 'check-out-time',
              type: 'input',
              defaultValue: '1',
            },
            {
              className: 'tui-form__row block small-field',
              key: 'workOtType',
              type: 'select',
              defaultValue: 1,
              templateOptions: {
                options: [
                  { value: 1, label: 'Hour' },
                  { value: 2, label: 'Minute' },
                ],
                labelClassName: 'font-semibold',
              },
            },
            {
              className: 'block my-5 small-field',
              key: 'hourMax',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Hour Max',
                required: true,
              },
            },
            {
              className: 'block my-5 small-field',
              key: 'minuteMax',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Minute Max',
                required: true,
              },
            },
            {
              key: 'minuteMax',
              type: '',
            },
          ],
        },
      ],
    },
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'grid grid-flow-col auto-cols-max col-custom',
          fieldGroup: [
            {
              key: 'weekendOt',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Weekend OT Break',
                size: 'l',
              },
            },
            {
              key: 'weekendOtSaturday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Saturday',
                size: 'l',
              },
            },
            {
              key: 'weekendOtSunday',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Sunday',
                size: 'l',
              },
            },
          ],
        },
      ],
    },
  ];

  constructor(private translocoService: TranslocoService) {}

  onSubmit(): void {
    const formModel = this.form.value;
    formModel.applyFor = Object.keys(formModel.applyFor).filter((key) => formModel.applyFor[key]);
    console.log(formModel);
  }
}
