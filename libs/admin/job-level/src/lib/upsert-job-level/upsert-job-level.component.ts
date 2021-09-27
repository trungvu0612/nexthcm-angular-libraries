import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { Level } from '../models/level';

@Component({
  selector: 'hcm-upsert-job-level',
  templateUrl: './upsert-job-level.component.html',
  styleUrls: ['./upsert-job-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertJobLevelComponent implements OnInit {
  form = this.fb.group<Level>({} as Level);
  model = {} as Level;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        { key: 'id' },
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Topic',
          },
        },
      ],
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Reason',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, Observable<Level>>
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
      console.log('formModellllll', formModel);
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
