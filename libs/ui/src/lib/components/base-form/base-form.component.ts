import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'hcm-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent<T extends Record<string, any>> {
  @Input() @tuiDefaultProp() form!: FormGroup<T>;
  @Input() model = {} as T;
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() options: FormlyFormOptions = {};

  @Output() submitForm = new EventEmitter();
  @Output() cancel = new EventEmitter();
}

@NgModule({
  declarations: [BaseFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, TranslocoModule, TuiButtonModule],
  exports: [BaseFormComponent],
})
export class BaseFormComponentModule {}
