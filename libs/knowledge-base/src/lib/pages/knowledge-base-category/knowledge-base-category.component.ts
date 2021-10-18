import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-knowledge-base-category',
  templateUrl: './knowledge-base-category.component.html',
  styleUrls: ['./knowledge-base-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseCategoryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
