import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { CommonStatus, JobTitle, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import omit from 'just-omit';
import { of } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { AdminJobTitlesService } from '../../services/admin-job-titles.service';

interface JobTitleForm extends JobTitle {
  statusBoolean?: boolean;
}

@Component({
  selector: 'hcm-upsert-job-title-dialog',
  templateUrl: './upsert-job-title-dialog.component.html',
  styleUrls: ['./upsert-job-title-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertJobTitleDialogComponent implements OnInit {
  form = this.fb.group({});
  model = {} as JobTitleForm;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
      },
      expressionProperties: { 'templateOptions.readonly': 'model.hasLDAPUser' },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.context.data?.name === name ? of(true) : this.adminJobTitlesService.checkNameExists(name)
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
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
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    {
      key: 'note',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'note',
        labelClassName: 'font-semibold',
        placeholder: 'enterNote',
      },
    },
    { key: 'id' },
  ];

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, JobTitle>,
    private readonly fb: FormBuilder,
    private readonly adminJobTitlesService: AdminJobTitlesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.state === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: JobTitleForm = { ...this.form.value };

      formModel.state = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.adminJobTitlesService
        .upsertJobLevel(omit(formModel, 'statusBoolean'))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            `${this.translocoScope.scope}.${
              formModel.id ? 'updateJobTitleSuccessfully' : 'createJobTitleSuccessfully'
            }`,
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
