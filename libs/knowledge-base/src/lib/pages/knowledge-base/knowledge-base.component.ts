import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Knowledge } from '../../models/knowledge';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hcm-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnowledgeBaseComponent {
  search!: string;
  readonly search$ = new BehaviorSubject('');
  data: Knowledge[] = [];

  constructor(readonly activatedRoute: ActivatedRoute) {
  }

  knowledgeCategoryPage() {
    if (this.activatedRoute.snapshot.params.id) {
      return true;
    } else {
      return false;
    }
  }
}
