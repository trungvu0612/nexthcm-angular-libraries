import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Knowledge } from '../../models/knowledge';

@Component({
  selector: 'hcm-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeComponent implements OnInit {
  id!: string;
  data$!: Observable<Partial<Knowledge>>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private policiesService: KnowledgeBaseService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    if (this.id) {
      this.data$ = this.policiesService.getKnowledge(this.id);
    }
  }
}
