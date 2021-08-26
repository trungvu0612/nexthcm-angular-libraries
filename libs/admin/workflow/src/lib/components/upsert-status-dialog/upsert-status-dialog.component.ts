import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { mapTo, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

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
        options: this.adminWorkflowService.select('statusTypes'),
        label: 'stateType',
        labelClassName: 'font-semibold',
        labelProp: 'name',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Status, Status>,
    private fb: FormBuilder,
    private adminWorkflowService: AdminWorkflowService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService
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
        ? this.adminWorkflowService.updateStatus(this.model).pipe(mapTo(this.model))
        : this.adminWorkflowService.createStatus(this.model)
      )
        .pipe(tap((res) => this.context.completeWith(res)))
        .subscribe(this.promptService.handleResponse());
    }
  }
}
