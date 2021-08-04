import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { UpdateRequestPayload } from '../../../../models';

@Component({
  selector: 'hcm-reject-leave-request-dialog',
  templateUrl: './reject-request-dialog.component.html',
  styleUrls: ['./reject-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectRequestDialogComponent {
  form = this.fb.group<UpdateRequestPayload>({} as UpdateRequestPayload);
  fields: FormlyFieldConfig[] = [
    { key: 'status', defaultValue: -1 },
    {
      key: 'reason',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'reason',
        labelClassName: 'font-semibold',
        placeholder: 'enterReason',
        required: true,
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<UpdateRequestPayload>
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.form.value);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
