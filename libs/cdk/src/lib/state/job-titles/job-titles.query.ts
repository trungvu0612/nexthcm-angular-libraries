import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseObject } from '../../models';
import { JobTitlesState, JobTitlesStore } from './job-titles.store';

@Injectable({ providedIn: 'root' })
export class JobTitlesQuery extends QueryEntity<JobTitlesState> {
  constructor(protected store: JobTitlesStore) {
    super(store);
  }

  searchJobTitles(searchQuery: string): Observable<BaseObject[]> {
    return this.selectAll().pipe(
      map((jobTitles) =>
        jobTitles.filter((jobTitle) => jobTitle.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
      )
    );
  }
}
