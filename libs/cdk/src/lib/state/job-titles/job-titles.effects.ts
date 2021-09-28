import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { loadJobTitles, refreshJobTitles } from './job-titles.actions';
import { JobTitlesQuery } from './job-titles.query';
import { JobTitlesService } from './job-titles.service';
import { JobTitlesStore } from './job-titles.store';

@Injectable()
export class JobTitlesEffects {
  @Effect()
  loadJobTitles$ = this.actions$.pipe(
    ofType(loadJobTitles),
    switchMap(() =>
      cacheable(this.store, this.jobTitlesService.getJobTitles().pipe(tap((jobTitles) => this.store.set(jobTitles))))
    )
  );

  @Effect()
  refreshJobTitlesSuccess$ = this.actions$.pipe(
    ofType(refreshJobTitles),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadJobTitles())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly jobTitlesService: JobTitlesService,
    private readonly store: JobTitlesStore,
    private readonly query: JobTitlesQuery
  ) {}
}
