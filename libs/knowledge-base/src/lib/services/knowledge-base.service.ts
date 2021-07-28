import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Category, Knowledge } from '../models/knowledge';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeBaseService {
  constructor(private http: HttpClient) {}

  getKnowledgeBase(params: { longDescription?: string; size: number }): Observable<Pagination<Partial<Knowledge>>> {
    return this.http
      .get<PagingResponse<Partial<Knowledge>>>('/mytimeapp/v1.0/policies', { params })
      .pipe(map((response) => response.data));
  }

  getKnowledge(id: string): Observable<Partial<Knowledge>> {
    return this.http.get<Partial<Knowledge>>('/mytimeapp/v1.0/policies/' + id);
  }

  getCategories(params: { [key: string]: number }): Observable<Pagination<Partial<Category>>> {
    return this.http
      .get<PagingResponse<Partial<Category>>>('/mytimeapp/v1.0/policy-category', { params })
      .pipe(map((response) => response.data));
  }

  getCategory(id: string): Observable<Partial<Category>> {
    return this.http.get<Partial<Category>>('/mytimeapp/v1.0/policy-category/' + id);
  }

  createCategory(category: Partial<Category>): Observable<unknown> {
    return this.http.post('/mytimeapp/v1.0/policy-category', category);
  }

  editCategory(category: Partial<Category>): Observable<unknown> {
    return this.http.put('/mytimeapp/v1.0/policy-category/' + category.id, category);
  }

  deleteCategory(id: string): Observable<unknown> {
    return this.http.delete('/mytimeapp/v1.0/policy-category/' + id);
  }
}
