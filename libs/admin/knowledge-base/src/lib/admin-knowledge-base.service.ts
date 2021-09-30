import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseObject, MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { AdminPolicy, Category } from './models/policies';
import { map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';

interface CategoryState {
  categories: Category[];
}

@Injectable()
export class AdminKnowledgeBaseService extends RxState<CategoryState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('categories', this.getCategories());
  }

  getPolicies(params: HttpParams): Observable<Pagination<AdminPolicy>> {
    return this.http
      .get<PagingResponse<AdminPolicy>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((res) => res.data));
  }

  getPolicy(id: string): Observable<AdminPolicy> {
    return this.http.get<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  createPolicies(dto: AdminPolicy): Observable<AdminPolicy> {
    return this.http.post<AdminPolicy>(`${MY_TIME_API_PATH}/policies`, dto);
  }

  editPolicies(dto: AdminPolicy, id: string): Observable<AdminPolicy> {
    return this.http.put<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`, dto);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policies/${id}`, {});
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<PagingResponse<Category>>(`${MY_TIME_API_PATH}/policy-category`, { params: new HttpParams().set('size', 999) })
      .pipe(map((response) => response.data.items));
  }

}
