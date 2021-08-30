import { Directive, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TransitionOption, TransitionOptions, TransitionOptionsDialogData, TransitionOptionType } from '../models';
import { AdminWorkflowsService } from '../services/admin-workflows.service';

@Directive()
export abstract class AbstractAddOptionToTransitionComponent<
  T extends TransitionOptionType,
  G extends TransitionOptions
> implements OnInit
{
  readonly form = this.fb.group<TransitionOption<T>>({} as TransitionOption<T>);
  model = {} as TransitionOption<T>;

  protected constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionOption<T>, TransitionOptionsDialogData<T, G>>,
    readonly adminWorkflowsService: AdminWorkflowsService
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
