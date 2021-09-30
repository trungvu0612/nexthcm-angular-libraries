import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'hcm-updated-knowledge',
  templateUrl: './updated-knowledge.component.html',
  styleUrls: ['./updated-knowledge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedKnowledgeComponent {
  readonly params$ = new BehaviorSubject<{ search?: string; size: number }>({ size: 10 });
  readonly knowledgeBase$ = this.params$.pipe(
    switchMap((params) => this.knowledgeBaseService.getKnowledgeBase(params))
  );
  readonly categoryKnowledge$ = this.params$.pipe(
    switchMap((params) => this.knowledgeBaseService.getCategoryKnowledgeBase(params))
  );

  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Input() set search(search$: Observable<string>) {
    search$.pipe(map((search) => ({ search: search, size: 10 }))).subscribe(this.params$);
  }

  viewMore() {
    this.params$.next(Object.assign(this.params$.value, { size: this.params$.value.size + 10 }));
  }
}
