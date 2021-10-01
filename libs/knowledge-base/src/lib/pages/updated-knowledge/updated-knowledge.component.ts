import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiMonth } from '@taiga-ui/cdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { ActivatedRoute, Router } from '@angular/router';
import { endOfMonth, setMonth, setYear, startOfMonth, startOfYear } from 'date-fns';

@Component({
  selector: 'hcm-updated-knowledge',
  templateUrl: './updated-knowledge.component.html',
  styleUrls: ['./updated-knowledge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedKnowledgeComponent {
  monthFilter: TuiMonth | null = null;
  params$ = new BehaviorSubject<{ search?: string; size: number }>({ size: 10 });

  // readonly params$ = new BehaviorSubject(
  //   new HttpParams().set('search', '').set('size', 10).set('startDate', '')
  // );

  knowledgeBase$ = this.params$.pipe(switchMap((params) => this.knowledgeBaseService.getKnowledgeBase(params)));
  readonly categoryKnowledge$ = this.params$.pipe(
    switchMap((params) => this.knowledgeBaseService.getCategoryKnowledgeBase(params))
  );

  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router
  ) {}

  @Input() set search(search$: Observable<string>) {
    search$.pipe(map((search) => ({ search: search, size: 10 }))).subscribe(this.params$);
  }

  viewMore() {
    this.params$.next(Object.assign(this.params$.value, { size: this.params$.value.size + 10 }));
  }

  get knowledgeSummaryPage(): boolean {
    return this.router.url.includes('summary');
  }

  get knowledgeUpdatedPage(): boolean {
    return this.router.url.includes('updated');
  }

  onChangeMonthFilter(value: TuiMonth | null) {
    const NOW = new Date();
    this.monthFilter = value;
    let fromDateUpdated = startOfMonth(
      setMonth(setYear(NOW, Number(this.monthFilter?.year)), this.monthFilter?.month as number)
    ).valueOf() as number;
    let toDateUpdated = endOfMonth(
      setMonth(setYear(NOW, Number(this.monthFilter?.year)), this.monthFilter?.month as number)
    ).valueOf() as number;

    this.params$ = new BehaviorSubject<{ fromDate?: number; toDate?: number; size: number }>({
      fromDate: fromDateUpdated,
      toDate: toDateUpdated,
      size: 10,
    });
    this.knowledgeBase$ = this.params$.pipe(
      switchMap((params) => this.knowledgeBaseService.getKnowledgeBaseByDate(params))
    );
  }
}
