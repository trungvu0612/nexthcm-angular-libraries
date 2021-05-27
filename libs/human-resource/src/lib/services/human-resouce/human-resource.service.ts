import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@nexthcm/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Node, OrgRes } from '../../models/node';

@Injectable({
  providedIn: 'root',
})
export class HumanResourceService {
  constructor(@Inject(ENVIRONMENT) protected env: Environment, public httpClient: HttpClient) {}

  getOrg(): Observable<OrgRes> {
    return this.httpClient
      .get<OrgRes>(this.env.orgUrl + '/accountapp/v1.0/org-chart/', {})
      .pipe(map((res) => res as OrgRes));
  }

  get(): Observable<Node[]> {
    return of([
      {
        id: 1,
        name: 'Vien Nguyen',
        job: 'general manager',
        img: '',
        children: [
          {
            id: 2,
            name: 'Son Nguyen',
            job: 'department manager',
            img: '',
            children: [
              { id: 3, name: 'Long Le Luoi', job: 'Linh danh thue', img: '' },
              { id: 4, name: 'Tin Khoc Nhe', job: 'Linh danh thue', img: '' },
              { id: 5, name: 'Luong Leo Cong Nha', job: 'Linh danh thue ', img: '' },
            ],
          },
        ],
      },
    ]);
  }
}
