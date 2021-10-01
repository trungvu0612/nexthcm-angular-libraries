import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Knowledge } from '../models/knowledge';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  constructor(private http: HttpClient) {}

  getKnowledgeBase(params: { search?: string; size: number }): Observable<Pagination<Partial<Knowledge>>> {
    return this.http
      .get<PagingResponse<Partial<Knowledge>>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((response) => response.data));
  }

  getKnowledgeBaseByDate(params: {
    fromDate?: number;
    toDate?: number;
    size: number;
  }): Observable<Pagination<Partial<Knowledge>>> {
    return this.http
      .get<PagingResponse<Partial<Knowledge>>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((response) => response.data));
  }

  getKnowledgeBaseCategory(
    params: { search?: string; size: number },
    policyId: any
  ): Observable<Pagination<Partial<Knowledge>>> {
    return this.http
      .get<PagingResponse<Partial<Knowledge>>>(`${MY_TIME_API_PATH}/policies?policyCategory.id=` + policyId, { params })
      .pipe(map((response) => response.data));
  }

  getCategoryKnowledgeBase(params: { search?: string; size: number }): Observable<Pagination<Partial<Category>>> {
    return this.http
      .get<PagingResponse<Partial<Category>>>(`${MY_TIME_API_PATH}/policy-category`, { params })
      .pipe(map((response) => response.data));
  }

  getKnowledge(id: string): Observable<Partial<Knowledge>> {
    return this.http.get<Partial<Knowledge>>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  getCategories(params: HttpParams): Observable<Pagination<Category>> {
    return this.http
      .get<PagingResponse<Category>>(`${MY_TIME_API_PATH}/policy-category`, { params })
      .pipe(map((response) => response.data));
  }

  getCategory(id: string): Observable<Partial<Category>> {
    return this.http.get<Partial<Category>>(`${MY_TIME_API_PATH}/policy-category/` + id);
  }

  createCategory(category: Partial<Category>): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/policy-category`, category);
  }

  editCategory(category: Partial<Category>): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/policy-category/${category.id}`, category);
  }

  deleteCategory(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policy-category/${id}`);
  }
}
