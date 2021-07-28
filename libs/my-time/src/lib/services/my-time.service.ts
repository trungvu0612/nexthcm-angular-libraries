import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { TrackingHistory } from '../models/tracking-history';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class MyTimeService {
  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private http: HttpClient) {}

  getTrackingHistory(id?: string): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${MY_TIME_PATH}/leaves/tracking-history/` + id);
  }
}
