import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KnowledgeBaseArticle, KnowledgeBaseCategory } from './models';

@Injectable()
export class AdminKnowledgeBaseService {
  constructor(private http: HttpClient) {}

  getKnowledgeBaseArticles(params: HttpParams): Observable<Pagination<KnowledgeBaseArticle>> {
    return this.http
      .get<PagingResponse<KnowledgeBaseArticle>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((res) => res.data));
  }

  getKnowledgeBaseArticle(id: string): Observable<KnowledgeBaseArticle> {
    return this.http.get<KnowledgeBaseArticle>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  upsertKnowledgeBaseArticle(payload: KnowledgeBaseArticle): Observable<unknown> {
    return payload.id ? this.editKnowledgeBaseArticle(payload) : this.createKnowledgeBaseArticle(payload);
  }

  createKnowledgeBaseArticle(payload: KnowledgeBaseArticle): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/policies`, payload);
  }

  editKnowledgeBaseArticle(payload: KnowledgeBaseArticle): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/policies/${payload.id}`, payload);
  }

  deleteKnowledgeBaseArticle(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  getKnowledgeBaseCategories(params: HttpParams): Observable<Pagination<KnowledgeBaseCategory>> {
    return this.http
      .get<PagingResponse<KnowledgeBaseCategory>>(`${MY_TIME_API_PATH}/policy-category`, { params })
      .pipe(map((res) => res.data));
  }

  upsertKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return payload.id ? this.editKnowledgeBaseCategory(payload) : this.createKnowledgeBaseCategory(payload);
  }

  createKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/policy-category`, payload);
  }

  editKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/policy-category/${payload.id}`, payload);
  }

  deleteKnowledgeBaseCategory(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policy-category/${id}`);
  }
}
