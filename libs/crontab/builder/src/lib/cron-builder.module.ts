import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiSelectModule, TuiTabsModule } from '@taiga-ui/kit';

import { QuartzCronDayComponent } from './components/quartz-cron/components/quartz-cron-day/quartz-cron-day.component';
import { QuartzCronHourComponent } from './components/quartz-cron/components/quartz-cron-hour/quartz-cron-hour.component';
import { QuartzCronIncrementComponent } from './components/quartz-cron/components/quartz-cron-increment/quartz-cron-increment.component';
import { QuartzCronMinuteComponent } from './components/quartz-cron/components/quartz-cron-minute/quartz-cron-minute.component';
import { QuartzCronMonthComponent } from './components/quartz-cron/components/quartz-cron-month/quartz-cron-month.component';
import { QuartzCronSecondComponent } from './components/quartz-cron/components/quartz-cron-second/quartz-cron-second.component';
import { QuartzCronYearComponent } from './components/quartz-cron/components/quartz-cron-year/quartz-cron-year.component';
import { QuartzCronComponent } from './components/quartz-cron/quartz-cron.component';
import { CronAndModule } from './shared/cron-and/cron-and.module';
import { CronContainerComponentModule } from './shared/cron-container/cron-container.component';
import { CronEveryComponentModule } from './shared/cron-every/cron-every.component';
import { CronRangeComponentModule } from './shared/cron-range/cron-range.component';

@NgModule({
  imports: [
    CommonModule,
    CronEveryComponentModule,
    TuiTabsModule,
    TuiCheckboxLabeledModule,
    FormsModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    CronAndModule,
    TuiCheckboxModule,
    CronRangeComponentModule,
    CronContainerComponentModule,
    TuiLetModule,
    ReactiveFormsModule,
    PushModule,
  ],
  declarations: [
    QuartzCronDayComponent,
    QuartzCronHourComponent,
    QuartzCronMinuteComponent,
    QuartzCronMonthComponent,
    QuartzCronSecondComponent,
    QuartzCronIncrementComponent,
    QuartzCronComponent,
    QuartzCronYearComponent,
  ],
  exports: [QuartzCronComponent],
})
export class CronBuilderModule {}
