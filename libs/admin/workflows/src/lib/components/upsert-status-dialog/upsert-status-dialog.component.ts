import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { delay, filter, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-upsert-status-dialog',
  templateUrl: './upsert-status-dialog.component.html',
  styleUrls: ['./upsert-status-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertStatusDialogComponent implements OnInit {
  editMode = false;
  form = this.fb.group<Status>({} as Status);
  model = {} as Status;
  fields: FormlyFieldConfig[] = [
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
      },
      asyncValidators: {
        uniqueStatusName: {
          expression: (control: FormControl<string>) =>
            of(control.value).pipe(
              delay(500),
              filter((name) => this.data.name !== name),
              switchMap((name) => this.adminWorkflowsService.checkStatusName({ name }))
            ),
          message: () => this.translocoService.selectTranslate('VALIDATION.uniqueStatusName'),
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
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateType',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        options: this.adminWorkflowsService.select('statusTypes'),
        label: 'stateType',
        labelClassName: 'font-semibold',
        labelProp: 'name',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Status, Status>,
    private readonly fb: FormBuilder,
    private readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {}

  get data(): Status {
    return this.context.data;
  }

  ngOnInit(): void {
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
