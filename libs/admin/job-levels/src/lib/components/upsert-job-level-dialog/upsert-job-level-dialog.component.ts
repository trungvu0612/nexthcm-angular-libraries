import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { JobLevel } from '../../models/job-level';
import { AdminJobLevelsService } from '../../services/admin-job-levels.service';

@Component({
  selector: 'hcm-upsert-job-level',
  templateUrl: './upsert-job-level-dialog.component.html',
  styleUrls: ['./upsert-job-level-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertJobLevelDialogComponent implements OnInit {
  form = this.fb.group<JobLevel>({} as JobLevel);
  model = {} as JobLevel;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'enterName',
        required: true,
      },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.context.data?.name === name ? of(true) : this.jobLevelsService.checkNameExists(name)
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    { key: 'id' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, JobLevel>,
    private readonly jobLevelsService: AdminJobLevelsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      this.jobLevelsService
        .upsertJobLevel(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            formModel.id ? 'jobLevels.updateJobLevelSuccessfully' : 'jobLevels.createJobLevelSuccessfully',
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
