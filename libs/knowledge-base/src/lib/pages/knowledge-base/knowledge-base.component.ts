import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Knowledge } from '../../models/knowledge';

@Component({
  selector: 'hcm-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseComponent {
  search!: string;
  data: Knowledge[] = [];
}
