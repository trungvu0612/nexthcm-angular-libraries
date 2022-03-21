import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule, TuiOrientationT } from '@taiga-ui/core';
import { TuiStepperModule } from '@taiga-ui/kit';

@Component({
  selector: 'hcm-formly-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      orientation: 'horizontal' as TuiOrientationT,
      activeItemIndex: 0,
    },
  };

  isValid(field: FormlyFieldConfig): boolean {
    return !!(field.key ? field?.formControl?.valid : field?.fieldGroup?.every((f) => this.isValid(f)));
  }
}

@NgModule({
  declarations: [StepperComponent],
  imports: [
    CommonModule,
    TuiStepperModule,
    FormlyModule.forChild({ types: [{ name: 'stepper', component: StepperComponent }] }),
    TuiButtonModule,
  ],
  exports: [StepperComponent],
})
export class StepperComponentModule {}
