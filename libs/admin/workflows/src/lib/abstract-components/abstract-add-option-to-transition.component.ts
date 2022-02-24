import { Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import { TransitionOptions, TransitionOptionsDialogData } from '../models';
import { AdminWorkflowsService } from '../services/admin-workflows.service';

@Directive()
export abstract class AbstractAddOptionToTransitionComponent<T extends TransitionOptions> implements OnInit {
  readonly form = this.fb.group<T>({} as T);
  model = {} as T;

  protected constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<T, TransitionOptionsDialogData<T>>,
    readonly adminWorkflowsService: AdminWorkflowsService
  ) {}

  ngOnInit(): void {
    if (this.context.data.item) {
      this.model = { ...this.model, ...this.context.data.item };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.form.value as T);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
