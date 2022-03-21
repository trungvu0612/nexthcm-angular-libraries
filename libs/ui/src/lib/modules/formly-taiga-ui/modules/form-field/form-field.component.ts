import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-formly-form-field',
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent extends FieldWrapper implements OnInit {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      labelClassName: 'font-semibold',
    },
  };
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<Record<string, never>>;

  error: TuiValidationError | null = null;
  readonly context!: { $implicit: any };

  ngOnInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
  }
}
