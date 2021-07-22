import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'hcm-updated-knowledge',
  templateUrl: './updated-knowledge.component.html',
  styleUrls: ['./updated-knowledge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedKnowledgeComponent {
  readonly size$ = new BehaviorSubject(10);
  readonly knowledgeBase$ = this.size$.pipe(switchMap((size) => this.knowledgeBaseService.getKnowledgeBase({ size })));

  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}
}
