import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'hcm-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeComponent {
  data$ = this.policiesService.getKnowledge(this.activatedRoute.snapshot.params.id);

  constructor(private policiesService: KnowledgeBaseService, private activatedRoute: ActivatedRoute) {}
}
