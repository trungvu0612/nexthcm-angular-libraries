import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Level, SearchLevel } from './models/level';

@Injectable({
  providedIn: 'root',
})
export class JobLevelService {
  appVersion = this.env.apiUrl + '/accountapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

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
