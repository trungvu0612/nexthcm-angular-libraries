import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CronNextRunTimePipeModule } from '@nexthcm/cdk';
import {
  CRON_LOCALIZATION,
  CronBuilderModule,
  CronLocalization,
  EN_LOCALIZATION,
  VI_LOCALIZATION,
} from '@nexthcm/cron-builder';
import { CronstrueModule } from '@nexthcm/cronstrue';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hcm-formly-quartz-cron',
  templateUrl: './formly-quartz-cron.component.html',
  styleUrls: ['./formly-quartz-cron.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuartzCronComponent extends FieldType {}

@NgModule({
  declarations: [FormlyQuartzCronComponent],
  imports: [
    CommonModule,
    PushModule,
    FormlyModule.forChild({ types: [{ name: 'quartz-cron', component: FormlyQuartzCronComponent }] }),
    ReactiveFormsModule,
    CronBuilderModule,
    CronstrueModule,
    CronNextRunTimePipeModule,
    TranslocoModule,
    TranslocoLocaleModule,
  ],
  providers: [
    {
      provide: CRON_LOCALIZATION,
      useFactory(translate: TranslocoService): Observable<CronLocalization> {
        return translate.langChanges$.pipe(map((lang) => (lang === 'vi' ? VI_LOCALIZATION : EN_LOCALIZATION)));
      },
      deps: [TranslocoService],
    },
  ],
  exports: [FormlyQuartzCronComponent],
})
export class FormlyQuartzCronComponentModule {}
