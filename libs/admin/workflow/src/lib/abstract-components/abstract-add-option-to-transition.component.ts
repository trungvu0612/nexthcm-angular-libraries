import { Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TransitionOption } from '../models';
import { AdminWorkflowService } from '../services/admin-workflow.service';

@Directive()
export abstract class AbstractAddOptionToTransitionComponent<T> implements OnInit {
  readonly form = this.fb.group<TransitionOption<T>>({} as TransitionOption<T>);
  model = {} as TransitionOption<T>;

  protected constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<TransitionOption<T>, TransitionOption<T>>,
    readonly adminWorkflowService: AdminWorkflowService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.form.value);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
