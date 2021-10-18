import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-knowledge-base-article',
  templateUrl: './knowledge-base-article.component.html',
  styleUrls: ['./knowledge-base-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseArticleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
