import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-create-leave-period',
  templateUrl: './create-leave-period.component.html',
  styleUrls: ['./create-leave-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateLeavePeriodComponent implements OnInit {

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'name',
          type: 'input-date',
          templateOptions: {
            label: 'officeName',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
          validation: {
            messages: {
              required: () => this.translocoService.selectTranslate('VALIDATION.required'),
            },
          },
        },
        {
          key: 'name1',
          type: 'input-date',
          templateOptions: {
            label: 'officeName',
            translate: true,
            required: true,
            textfieldLabelOutside: true,
          },
          validation: {
            messages: {
              required: () => this.translocoService.selectTranslate('VALIDATION.required'),
            },
          },
        },
      ],
    },

  ];

  constructor(
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
  }

  submit() {

  }

  cancel() {

  }
}
