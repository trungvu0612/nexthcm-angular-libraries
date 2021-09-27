import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from './models/level';

@Injectable()
export class JobLevelService {
  constructor(private httpClient: HttpClient) {}

  getLevels(params: HttpParams): Observable<Pagination<Level>> {
    return this.httpClient
      .get<PagingResponse<Level>>(`${ACCOUNT_API_PATH}/levels`, { params })
      .pipe(map((res) => res.data));
  }

  createLevel(dto: Level): Observable<Level> {
    return this.httpClient.post<Level>(`${ACCOUNT_API_PATH}/levels`, dto);
  }

  editLevel(dto: Level): Observable<Level> {
    return this.httpClient.put<Level>(`${ACCOUNT_API_PATH}/levels/${dto ? dto.id : ''}`, dto);
  }

  deleteAdminJobLevel(id: string): Observable<unknown> {
    return this.httpClient.delete(`${ACCOUNT_API_PATH}/levels/${id}`);
  }
}
