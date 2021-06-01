import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { Environment, ENVIRONMENT } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LeaveTypeStore } from '../../../../my-time/src/lib/state/leave-type/leave-type.store';
import { Level } from '../models/level';
import { LEVEL_PAGINATOR } from '../state/level/level.paginator';
import { LevelState } from '../state/level/level.store';

@Injectable({
  providedIn: 'root',
})
export class JobLevelService {
  appVersion = this.env.apiUrl + '/accountapp/v1.0';

  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private leaveTypeStore: LeaveTypeStore,
    private httpClient: HttpClient,
    @Inject(LEVEL_PAGINATOR) public paginatorRef: PaginatorPlugin<LevelState>
  ) {}

  getLevels(pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.appVersion + '/level', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLevel(id: string): Observable<Level> {
    return this.httpClient
      .get<Level>(this.appVersion + '/level' + '/' + id)
      .pipe(tap((obj) => this.leaveTypeStore.upsert(id, obj)));
  }

  createLevel(dto: Level): Observable<Level> {
    return this.httpClient.post<Level>(this.appVersion + '/level', dto).pipe(
      tap(() => {
        this.paginatorRef.clearCache({ clearStore: true });
      })
    );
  }

  editLevel(dto: Level, id: string): Observable<Level> {
    return this.httpClient.put<Level>(this.appVersion + `/level/${id}`, dto).pipe(
      tap(() => {
        this.paginatorRef.clearCache({ clearStore: true });
      })
    );
  }
}
