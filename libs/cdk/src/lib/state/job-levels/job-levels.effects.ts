import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { loadJobLevels, refreshJobLevels } from './job-levels.actions';
import { JobLevelsQuery } from './job-levels.query';
import { JobLevelsService } from './job-levels.service';
import { JobLevelsStore } from './job-levels.store';

@Injectable()
export class JobLevelsEffects {
  @Effect()
  loadJobLevels$ = this.actions$.pipe(
    ofType(loadJobLevels),
    switchMap(() =>
      cacheable(this.store, this.jobLevelsService.getJobLevels().pipe(tap((jobLevels) => this.store.set(jobLevels))))
    )
  );

  @Effect()
  refreshJobLevels$ = this.actions$.pipe(
    ofType(refreshJobLevels),
    filter(() => this.query.getHasCache()),
    tap(() => this.store.setHasCache(false)),
    map(() => loadJobLevels())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly jobLevelsService: JobLevelsService,
    private readonly store: JobLevelsStore,
    private readonly query: JobLevelsQuery
  ) {}
}
