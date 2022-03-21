import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  NgModule,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { Type } from '@sbzen/cron-core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

import { CronLocalization } from '../../models';
import { CRON_LOCALIZATION } from '../../tokens';

@Component({
  selector: 'hcm-cron-container',
  templateUrl: './cron-container.component.html',
  styleUrls: ['./cron-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CronContainerComponent {
  @ContentChild('content') content!: TemplateRef<HTMLDivElement>;
  @ViewChildren('tabEl', { read: ElementRef }) tabEls: QueryList<ElementRef> | null = null;
  @Input() hostClass = '';
  @Input() activeTabIndex = 0;
  @Input() tabs: Type[] = [];
  @Input() hideTabs = false;

  constructor(@Inject(CRON_LOCALIZATION) readonly localization$: Observable<CronLocalization>) {}

  readonly tabLocalization = (item: string) => item as keyof CronLocalization['tabs'];
}

@NgModule({
  imports: [TuiTabsModule, CommonModule, PushModule],
  declarations: [CronContainerComponent],
  exports: [CronContainerComponent],
})
export class CronContainerComponentModule {}
