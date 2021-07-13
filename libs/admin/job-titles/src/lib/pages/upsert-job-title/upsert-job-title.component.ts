import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { JobTitle } from '../../models/job-title';
import { AdminJobTitlesService } from '../../services/admin-job-titles.service';

@Component({
  selector: 'hcm-upsert-job-title',
  templateUrl: './upsert-job-title.component.html',
  styleUrls: ['./upsert-job-title.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertJobTitleComponent implements OnInit {
  id!: string;
  data = this.context.data || '';
  form = new FormGroup<JobTitle>({});
  model: JobTitle = {};

  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      /*Ten chuc vu*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Tên chức vụ</p>
        `,
        },
        {
          className: 'col-span-2',
          key: 'name',
          type: 'input',
          templateOptions: {
            translate: true,
            required: true,
          },
          validation: {
            messages: {
              required: () => this.translocoService.selectTranslate('VALIDATION.required'),
            },
          },
        },
      ],
    },

    {
      /*Trạng thái*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: '',
          template: `
        <p class='font-bold'>Trạng thái</p>
        `,
        },

        {
          fieldGroupClassName: 'flex justify-center col-span-3 gap-8',
          fieldGroup: [
            {
              className: '',
              key: 'stateCov',
              type: 'toggle',
              templateOptions: { textfieldLabelOutside: true },
              expressionProperties: {
                // 'templateOptions.label': of('Active:'),
                'templateOptions.description': of('Active'),
              },
            },
            {
              className: '',
              template: `
                    <p class='font-bold'>Có cấp độ</p>
                    `,
            },
          ],
        },

        {
          className: 'flex flex-wrap content-center grid justify-items-center',
          key: 'hasLevel',
          type: 'checkbox',
        },
      ],
    },

    {
      /*Mô Tả*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Mô Tả</p>
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
      /*Note*/ fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
      fieldGroup: [
        {
          className: 'flex items-center ',
          template: `
        <p class='font-bold'>Note</p>
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
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, JobTitle>,
    private translocoService: TranslocoService,
    private adminJobTitlesService: AdminJobTitlesService
  ) {}

  ngOnInit(): void {
    console.log('iddddd data', this.data);
    if (this.data !== '') {
      this.adminJobTitlesService.getAdminJobTitleId(this.data).subscribe((item) => {
        // console.log(item)

        this.model = { ...this.model, ...item };

        // if (item.hasLevel){
        //   this.model.hasLevel = true
        // } else {
        //   this.model.hasLevel = false
        // }
        //
        // if (item.state === 1){
        //   this.model.stateCov = true
        // } else {
        //   this.model.stateCov = false
        // }
      });
    } else {
      this.model.hasLevel = true;
      this.model.stateCov = true;
    }
  }

  submit() {
    if (this.model.stateCov) {
      this.model.state = 1;
    } else {
      this.model.state = 0;
    }
    const body: JobTitle = {
      name: this.model.name,
      description: this.model.description,
      hasLevel: this.model.hasLevel,
      state: this.model.state,
    };
    this.context.completeWith(this.model);
  }

  cancel() {}

  save() {}
}
