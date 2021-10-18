import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'hcm-knowledge-base-categories',
  templateUrl: './knowledge-base-categories.component.html',
  styleUrls: ['./knowledge-base-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseCategoriesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
