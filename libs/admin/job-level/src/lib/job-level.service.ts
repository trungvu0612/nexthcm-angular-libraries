import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from './models/level';

const MY_ACCOUNT_PATH = '/accountapp/v1.0';

@Injectable()
export class JobLevelService {
  constructor(private httpClient: HttpClient) {}

  getLevels(params: HttpParams): Observable<Pagination<Level>> {
    return this.httpClient
      .get<PagingResponse<Level>>(`${MY_ACCOUNT_PATH}/levels`, { params })
      .pipe(map((res) => res.data));
  }

  createLevel(dto: Level): Observable<Level> {
    return this.httpClient.post<Level>(`${MY_ACCOUNT_PATH}/levels`, dto);
  }

  editLevel(dto: Level): Observable<Level> {
    console.log('dtooooooôo', dto)
    return this.httpClient.put<Level>(`${MY_ACCOUNT_PATH}/levels/${dto ? dto.id : ''}`, dto);
  }

  deleteAdminJobLevel(id: string): Observable<Level> {
    return this.httpClient.delete<Level>(`${MY_ACCOUNT_PATH}/levels/${id}`);
  }
}
