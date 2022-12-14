import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { tuiDefaultProp } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'hcm-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseFormComponent<T> {
  @Input() @tuiDefaultProp() form = new FormGroup({});
  @Input() model: T = {} as T;
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() options: FormlyFormOptions = {};
  @Input() submitLoading = false;
  @Input() submitPermission: string | string[] = [];
  @Input() submitDisabled = false;

  @Output() submitForm = new EventEmitter();
  @Output() cancel = new EventEmitter();

  private _hideCancelButton = false;

  get hideCancelButton(): boolean {
    return this._hideCancelButton;
  }

  @Input()
  set hideCancelButton(value: unknown) {
    this._hideCancelButton = coerceBooleanProperty(value);
  }
}

@NgModule({
  declarations: [BaseFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, TranslocoModule, TuiButtonModule, NgxPermissionsModule],
  exports: [BaseFormComponent],
})
export class BaseFormComponentModule {}
