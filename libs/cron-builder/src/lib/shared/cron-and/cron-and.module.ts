import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiPrimitiveCheckboxModule } from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { CronAndOptionComponent } from './cron-and-option/cron-and-option.component';
import { CronAndComponent } from './cron-and.component';

@NgModule({
  imports: [CommonModule, TuiCheckboxModule, ReactiveFormsModule, TuiPrimitiveCheckboxModule],
  declarations: [CronAndComponent, CronAndOptionComponent],
  exports: [CronAndComponent],
})
export class CronAndModule {}
