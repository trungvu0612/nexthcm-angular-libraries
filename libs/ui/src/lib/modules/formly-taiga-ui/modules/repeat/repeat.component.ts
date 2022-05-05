import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';

@Component({
  selector: 'hcm-formly-repeat',
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatComponent extends FieldArrayType {}

@NgModule({
  declarations: [RepeatComponent],
  imports: [
    CommonModule,
    FormlyModule.forChild({ types: [{ name: 'repeat', component: RepeatComponent }] }),
    TuiButtonModule,
    TuiLabelModule,
  ],
})
export class RepeatModule {}
