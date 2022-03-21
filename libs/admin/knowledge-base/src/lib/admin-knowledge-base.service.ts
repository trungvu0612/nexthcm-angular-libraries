import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH } from '@nexthcm/cdk';
import { KnowledgeBaseArticle, KnowledgeBaseCategory } from '@nexthcm/knowledge-base';
import { RxState } from '@rx-angular/state';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';

interface AdminKnowledgeBaseState {
  categories: KnowledgeBaseCategory[];
}

@Injectable()
export class AdminKnowledgeBaseService extends RxState<AdminKnowledgeBaseState> {
  readonly categories$ = this.select('categories');
  private readonly loadCategories$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {
    super();
    this.connect('categories', this.loadCategories$.pipe(switchMap(() => this.getAllKnowledgeBaseCategories())));
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

  checkKnowledgeBaseArticleNameExists(name: string): Observable<boolean> {
    return this.http
      .get(`${MY_TIME_API_PATH}/policies/check-existing`, { params: new HttpParams().set('name', name) })
      .pipe(
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
      .pipe(tap((data) => this.doRefreshCategories()));
  }

  editKnowledgeBaseCategory(payload: KnowledgeBaseCategory): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/policy-category/${payload.id}`, payload)
      .pipe(tap(() => this.doRefreshCategories()));
  }

  deleteKnowledgeBaseCategory(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policy-category/${id}`).pipe(tap(() => this.doRefreshCategories()));
  }

  checkKnowledgeBaseCategoryNameExists(name: string): Observable<boolean> {
    return this.http
      .get(`${MY_TIME_API_PATH}/policy-category/check-existing`, { params: new HttpParams().set('name', name) })
      .pipe(
        mapTo(true),
        catchError(() => of(false))
      );
  }

  doLoadCategories(): void {
    if (!this.get('categories')) {
      this.loadCategories$.next();
    }
  }

  doRefreshCategories(): void {
    if (this.get('categories')) {
      this.loadCategories$.next();
    }
  }
}
