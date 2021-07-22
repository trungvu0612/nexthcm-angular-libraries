import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Knowledge } from '../models/knowledge';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  constructor(private http: HttpClient) {}

  getKnowledgeBase(params: { [key: string]: number }): Observable<Pagination<Partial<Knowledge>>> {
    return this.http
      .get<PagingResponse<Partial<Knowledge>>>('/mytimeapp/v1.0/policies', { params })
      .pipe(map((response) => response.data));
  }

  getKnowledge(id: string): Observable<Partial<Knowledge>> {
    return this.http.get<Partial<Knowledge>>('/mytimeapp/v1.0/policies/' + id);
  }

  createKnowledge(knowledge: Partial<Knowledge>): Observable<unknown> {
    return this.http.post('/mytimeapp/v1.0/policies', knowledge);
  }

  editKnowledge(knowledge: Partial<Knowledge>, id: string): Observable<unknown> {
    return this.http.put('/mytimeapp/v1.0/policies/' + id, knowledge);
  }
}
