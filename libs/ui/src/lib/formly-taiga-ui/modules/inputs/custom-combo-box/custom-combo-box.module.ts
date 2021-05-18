import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiHostedDropdownModule, TuiPrimitiveTextfieldModule } from '@taiga-ui/core';
import { TuiArrowModule } from '@taiga-ui/kit/components/arrow';
import { TuiSelectOptionModule } from '@taiga-ui/kit/components/select-option';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { CustomTuiComboBoxComponent } from './custom-combo-box.component';

@NgModule({
  imports: [
    CommonModule,
    PolymorpheusModule,
    TuiActiveZoneModule,
    TuiPrimitiveTextfieldModule,
    TuiHostedDropdownModule,
    TuiSelectOptionModule,
    TuiArrowModule,
  ],
  declarations: [CustomTuiComboBoxComponent],
  exports: [CustomTuiComboBoxComponent],
})
export class CustomTuiComboBoxModule {}
