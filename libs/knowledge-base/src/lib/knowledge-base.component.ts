import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-knowledge-base',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseComponent {
  constructor(headerService: HeaderService) {
    headerService.set({
      root: '/knowledge-base',
      tabs: [
        { path: '', tabName: 'knowledgeBase' },
        { path: '/updated', tabName: 'updated' },
      ],
    });
  }
}
