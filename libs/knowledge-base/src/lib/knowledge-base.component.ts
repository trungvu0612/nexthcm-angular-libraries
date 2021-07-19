import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-knowledge-base',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.set({
      root: '/knowledge-base',
      tabs: [
        { path: '', tabName: 'policy' },
        { path: '/updated', tabName: 'updated' },
      ],
    });
  }
}
