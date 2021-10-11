import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SynchronizationSetting } from '../models/synchronization-setting';

@Injectable()
export class SynchronizeDataService {
  constructor(private readonly http: HttpClient) {}

  getSynchronizationSettings(): Observable<SynchronizationSetting[]> {
    return this.http
      .get<BaseResponse<SynchronizationSetting[]>>(`${ACCOUNT_API_PATH}/schedulers`)
      .pipe(map((res) => res.data));
  }

  editSynchronizationSetting(payload: SynchronizationSetting): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/schedulers/${payload.id}`, payload);
  }

  synchronizeManually(id: string): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/schedulers/run-manually`, { id });
  }
}
