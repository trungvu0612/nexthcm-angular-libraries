import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ACCOUNT_API_PATH } from '../../constants';
import { Workflow } from '../../models/workflow';

@Injectable({
  providedIn: 'root',
})
export class WorkflowsService {
  constructor(private http: HttpClient) {}

  getAllWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${ACCOUNT_API_PATH}/process/all`);
  }
}
