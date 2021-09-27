import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import { AdminPolicy } from '../../models/policies';

@Component({
  selector: 'hcm-list-policies',
  templateUrl: './list-policies.component.html',
  styleUrls: ['./list-policies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class ListPoliciesComponent extends AbstractServerSortPaginationTableComponent<AdminPolicy> {
  @ViewChild('table') table!: BaseComponent;
  columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'topic', title: result.topic },
        { key: 'shortDescription', title: result.shortDescription },
        { key: 'createdDate', title: result.createdDate },
        { key: 'operations', title: result.operations, orderEnabled: false },
      ])
    );

  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.policiesService.getPolicies(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<AdminPolicy>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private policiesService: AdminKnowledgeBaseService,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  delete(id: string) {
    from(
      this.promptService.open({
        icon: 'question',
        text: this.translocoService.translate(`adminKnowledgeBase.deletePolicy`),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() =>
          this.policiesService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
        ),
        catchError((err) => this.promptService.open({ icon: 'error', text: err.error.message })),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
