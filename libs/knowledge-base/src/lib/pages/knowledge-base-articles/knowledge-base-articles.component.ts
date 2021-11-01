import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-knowledge-base-articles',
  templateUrl: './knowledge-base-articles.component.html',
  styleUrls: ['./knowledge-base-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseArticlesComponent {}
