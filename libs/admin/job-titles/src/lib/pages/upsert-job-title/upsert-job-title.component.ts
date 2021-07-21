import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable, of } from 'rxjs';
import { JobTitle } from '../../models/job-title';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-upsert-job-title',
  templateUrl: './upsert-job-title.component.html',
  styleUrls: ['./upsert-job-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertJobTitleComponent implements OnInit {
  data$: any
  form = new FormGroup<JobTitle>({});
  model: JobTitle = { hasLevel: true, stateCov: true };
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

    {
      /*Trạng thái*/
      fieldGroupClassName: 'mt-4 grid grid-cols-3 gap-4',
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
                'templateOptions.description': 'model.stateCov ? "Active" : "Deactive"',
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
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<JobTitle, Observable<JobTitle>>,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data === null || this.context.data === undefined){
      this.data$ = of(this.model = {})
    } else {
      this.data$ = this.context.data.pipe(tap((value) => value && Object.assign(this.model, value))) || of(null);
    }
  }

  submit() {
    if (this.model.stateCov) this.model.state = 1;
    else this.model.state = 0;
    this.context.completeWith(this.model);
  }

  cancel() {}

  save() {}
}
