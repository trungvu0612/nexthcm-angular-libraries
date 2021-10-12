import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldWrapper, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiErrorModule, TuiLabelModule } from '@taiga-ui/core';
import { PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-form-field-label-outside',
  templateUrl: './form-field-label-outside.component.html',
  styleUrls: ['./form-field-label-outside.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldLabelOutsideComponent extends FieldWrapper implements OnInit {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      labelClassName: 'font-semibold',
    },
  };
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<{}>;

  error: TuiValidationError | null = null;
  readonly context!: { $implicit: any };

  ngOnInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
  }
}

@NgModule({
  imports: [
    ReactiveFormsModule,
    TuiLabelModule,
    PolymorpheusModule,
    FormlyModule.forChild({
      wrappers: [
        {
          name: 'form-field-label-outside',
          component: FormFieldLabelOutsideComponent,
        },
      ],
    }),
    TuiErrorModule,
    CommonModule,
  ],
  declarations: [FormFieldLabelOutsideComponent],
  exports: [FormFieldLabelOutsideComponent],
})
export class FormFieldLabelOutsideComponentModule {}
