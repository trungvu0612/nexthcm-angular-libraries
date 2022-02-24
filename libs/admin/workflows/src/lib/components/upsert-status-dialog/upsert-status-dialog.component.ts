import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { BaseUser, PromptService, WorkflowStatusType } from '@nexthcm/cdk';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { debounceTime, mapTo, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { Status } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { loadStatusTypes, StatusTypesQuery } from '../../state';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-status-dialog',
  templateUrl: './upsert-status-dialog.component.html',
  styleUrls: ['./upsert-status-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertStatusDialogComponent implements OnInit {
  @ViewChild('statusTypeContent', { static: true }) statusTypeContent!: PolymorpheusTemplate<BaseUser>;

  readonly statusTypeContext!: { $implicit: WorkflowStatusType };
  fields!: FormlyFieldConfig[];
  editMode = false;
  form = this.fb.group<Status>({} as Status);
  model = {} as Status;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Status, Status>,
    private readonly fb: FormBuilder,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly statusTypesQuery: StatusTypesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadStatusTypes());
  }

  get data(): Status {
    return this.context.data;
  }

  ngOnInit(): void {
    this.fields = [
      { key: 'id', defaultValue: uuidv4() },
      {
        className: 'tui-form__row block',
        key: 'name',
        type: 'input',
        templateOptions: {
          required: true,
          translate: true,
          label: 'name',
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          placeholder: 'enterName',
        },
        asyncValidators: {
          name: {
            expression: (control: FormControl<string>) =>
              !control.valueChanges || control.pristine
                ? of(true)
                : control.valueChanges.pipe(
                    debounceTime(1000),
                    take(1),
                    switchMap((name) =>
                      this.data.name === name ? of(true) : this.adminWorkflowsService.checkStatusName({ name })
                    ),
                    tap(() => control.markAsTouched())
                  ),
            message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
          },
        },
      },
      {
        className: 'tui-form__row block',
        key: 'description',
        type: 'text-area',
        templateOptions: {
          translate: true,
          label: 'description',
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          placeholder: 'enterDescription',
        },
      },
      {
        className: 'tui-form__row block',
        key: 'stateType',
        type: 'select',
        templateOptions: {
          translate: true,
          required: true,
          options: this.statusTypesQuery.selectAll(),
          label: `${TRANSLATION_SCOPE}.statusType`,
          labelClassName: 'font-semibold',
          labelProp: 'name',
          placeholder: `${TRANSLATION_SCOPE}.chooseStatusType`,
          customContent: this.statusTypeContent,
        },
      },
    ];

    if (this.data) {
      this.editMode = !!this.data.id;
      this.model = { ...this.model, ...this.data };
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      (this.editMode
        ? this.adminWorkflowsService.updateStatus(this.model).pipe(mapTo(this.model))
        : this.adminWorkflowsService.createStatus(this.model)
      )
        .pipe(
          tap((res) => this.context.completeWith(res)),
          takeUntil(this.destroy$)
        )
        .subscribe(this.promptService.handleResponse());
    }
  }
}
