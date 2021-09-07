import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ACCOUNT_API_PATH } from '../../constants';
import { BaseObject } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class JobTitlesService {
  constructor(private readonly http: HttpClient) {}

  getJobTitles(): Observable<BaseObject[]> {
    return this.http.get<BaseObject[]>(`${ACCOUNT_API_PATH}/titles/v2`).pipe(catchError(() => of([])));
  }
}
