import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { BaseResponse, MY_TIME_API_PATH } from '@nexthcm/cdk';
import { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@nexthcm/knowledge-base';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { upsertKnowledgeBaseCategory } from './state/knowledge-base-categories';

@Injectable()
export class AdminKnowledgeBaseService {
  constructor(private readonly http: HttpClient, private readonly actions: Actions) {}

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

  checkKnowledgeBaseArticleNameExists(name: string): Observable<boolean> {
    return this.http.get(`${MY_TIME_API_PATH}/policies/check-existing?name=${name}`).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }

  getAllKnowledgeBaseCategories(): Observable<KnowledgeBaseCategory[]> {
    return this.http
      .get<BaseResponse<KnowledgeBaseCategory[]>>(`${MY_TIME_API_PATH}/policy-categories`)
      .pipe(map((res) => res.data));
  }

  upsertKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return payload.id ? this.editKnowledgeBaseCategory(payload) : this.createKnowledgeBaseCategory(payload);
  }

  createKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return this.http
      .post<KnowledgeBaseCategory>(`${MY_TIME_API_PATH}/policy-category`, payload)
      .pipe(tap((data) => this.actions.dispatch(upsertKnowledgeBaseCategory({ data }))));
  }

  editKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/policy-category/${payload.id}`, payload)
      .pipe(tap(() => this.actions.dispatch(upsertKnowledgeBaseCategory({ data: payload }))));
  }

  deleteKnowledgeBaseCategory(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policy-category/${id}`);
  }

  checkKnowledgeBaseCategoryNameExists(name: string): Observable<boolean> {
    return this.http.get(`${MY_TIME_API_PATH}/policy-category/check-existing?name=${name}`).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }
}
