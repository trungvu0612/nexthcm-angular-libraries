import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { JobTitle } from '../../models/job-title';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-upsert-job-title',
  templateUrl: './upsert-job-title.component.html',
  styleUrls: ['./upsert-job-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertJobTitleComponent implements OnInit {
  form = this.fb.group<JobTitle>({} as JobTitle);
  model = {} as JobTitle;

  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Tên chức vụ</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'name',
          type: 'input',
          templateOptions: {
            translate: true,
            required: true,
            textfieldLabelOutside: true
          },
          expressionProperties: { 'templateOptions.readonly': 'model.hasLDAPUser' }
        }
      ],
    },

    {
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: '',
          template: `
        <p class="font-bold">Trạng thái</p>
        `,
        },

        {
          fieldGroupClassName: 'flex justify-center col-span-3 gap-8',
          fieldGroup: [
            {
              className: '',
              key: 'state',
              type: 'toggle',
              defaultValue: true,
              templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
              expressionProperties: {
                'templateOptions.description': this.form?.valueChanges.pipe(
                  startWith(null),
                  map((value) => value?.state),
                  distinctUntilChanged(),
                  switchMap((state) => this.translocoService.selectTranslate(`${state ? 'active' : 'inactive'}`))
                )
              }
            },
            {
              className: '',
              template: `
                    <p class="font-bold">Có cấp độ</p>
                    `,
            },
          ],
        },

        {
          className: 'flex flex-wrap content-center grid justify-items-center',
          key: 'hasLevel',
          type: 'toggle',
        },
      ],
    },

    {
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Mô Tả</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'description',
          type: 'text-area',
          templateOptions: {
            translate: true,
          },
        },
      ],
    },

    {
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class="font-bold">Note</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'note',
          type: 'text-area',
        },
      ],
    },
  ];

  constructor(
    private translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, Observable<JobTitle>>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.value.state = this.model.state ? 1 : 0;
      const formModel = { ...this.form.value };
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
