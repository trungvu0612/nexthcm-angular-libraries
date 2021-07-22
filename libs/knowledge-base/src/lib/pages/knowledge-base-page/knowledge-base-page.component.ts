import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Knowledge } from '../../models/knowledge';

@Component({
  selector: 'hcm-knowledge-base-page',
  templateUrl: './knowledge-base-page.component.html',
  styleUrls: ['./knowledge-base-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBasePageComponent {
  data: Knowledge[] = [];
}
