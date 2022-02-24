import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScheduledTask } from '../models/scheduled-task';

@Injectable()
export class TaskSchedulerService {
  constructor(private readonly http: HttpClient) {}

  getScheduledTasks(): Observable<ScheduledTask[]> {
    return this.http.get<BaseResponse<ScheduledTask[]>>(`${ACCOUNT_API_PATH}/schedulers`).pipe(map((res) => res.data));
  }

  editScheduledTask(payload: ScheduledTask): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/schedulers/${payload.id}`, payload);
  }

  executeManually(id: string): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/schedulers/run-manually`, { id });
  }
}
