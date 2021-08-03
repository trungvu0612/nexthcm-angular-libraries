import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { SubmitRejectRequest } from '../../models/requests';

@Component({
  selector: 'hcm-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RejectDialogComponent {
  form = new FormGroup<any>({});
  model!: SubmitRejectRequest;
  requestForm!: FormGroup<SubmitRejectRequest>;
  fields: FormlyFieldConfig[] = [
    {
      key: 'reason',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Reason',
      },
    },
  ];

  constructor(
    private formbuilder: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, { type: string }>
  ) {
    this.requestForm = this.formbuilder.group<SubmitRejectRequest>({});
  }

  close(): void {
    this.context.$implicit.complete();
  }

  submit(): void {
    if (this.requestForm.valid) {
      const formModel = this.requestForm.value;
      const obj = {
        status: '-1',
        reason: formModel.reason,
      };
      this.context.completeWith(obj);
    }
  }
}
