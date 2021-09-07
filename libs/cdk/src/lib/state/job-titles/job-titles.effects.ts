import { Injectable } from '@angular/core';
import { cacheable } from '@datorama/akita';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { switchMap, tap } from 'rxjs/operators';
import { JobTitlesService } from '../../services/job-titles/job-titles.service';
import { loadJobTitles } from './job-titles.actions';
import { JobTitlesStore } from './job-titles.store';

@Injectable()
export class JobTitlesEffects {
  @Effect()
  loadJobTitles$ = this.actions$.pipe(
    ofType(loadJobTitles),
    switchMap(() =>
      cacheable(
        this.jobTitlesStore,
        this.jobTitlesService.getJobTitles().pipe(tap((jobTitles) => this.jobTitlesStore.set(jobTitles)))
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly jobTitlesService: JobTitlesService,
    private readonly jobTitlesStore: JobTitlesStore
  ) {}
}
