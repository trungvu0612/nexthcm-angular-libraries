import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { Level, SearchLevel } from './models/level';

@Injectable({
  providedIn: 'root',
})
export class JobLevelService {
  appVersion = '/accountapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getLevels(pageIndex: number, pageSize: number, search: SearchLevel): Observable<PagingResponse<Level>> {
    return this.httpClient.get<PagingResponse<Level>>(this.appVersion + '/levels', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getLevel(id: string): Observable<Level> {
    return this.httpClient.get<Level>(this.appVersion + '/levels' + '/' + id);
  }

  createLevel(dto: Level): Observable<Level> {
    return this.httpClient.post<Level>(this.appVersion + '/levels', dto);
  }

  editLevel(dto: Level, id: string): Observable<Level> {
    return this.httpClient.put<Level>(this.appVersion + `/levels/${id}`, dto);
  }
}
