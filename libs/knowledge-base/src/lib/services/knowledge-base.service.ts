import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KnowledgeBaseArticle, KnowledgeBaseCategory } from '../models';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly http: HttpClient) {}

  getKnowledgeBaseArticles(params: HttpParams): Observable<Pagination<KnowledgeBaseArticle>> {
    return this.http
      .get<PagingResponse<KnowledgeBaseArticle>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((res) => res.data));
  }

  getKnowledgeBaseArticle(id: string): Observable<KnowledgeBaseArticle> {
    return this.http.get<KnowledgeBaseArticle>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  getKnowledgeBaseCategories(params: HttpParams): Observable<Pagination<KnowledgeBaseCategory>> {
    return this.http
      .get<PagingResponse<KnowledgeBaseCategory>>(`${MY_TIME_API_PATH}/policy-category`, { params })
      .pipe(map((res) => res.data));
  }

  getKnowledgeBaseCategory(id: string): Observable<KnowledgeBaseCategory> {
    return this.http.get<KnowledgeBaseCategory>(`${MY_TIME_API_PATH}/policy-category/${id}`);
  }
}
