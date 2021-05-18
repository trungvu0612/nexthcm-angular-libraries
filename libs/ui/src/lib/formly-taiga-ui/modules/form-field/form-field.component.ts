import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'formly-form-field',
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent extends FieldWrapper implements OnInit {
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<{}>;

  error: TuiValidationError | null = null;
  readonly context!: { $implicit: any };

  ngOnInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
  }
}
