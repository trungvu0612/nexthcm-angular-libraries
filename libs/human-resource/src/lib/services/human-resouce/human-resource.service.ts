import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Node } from '../../models/node';

@Injectable({
  providedIn: 'root'
})
export class HumanResourceService {

  constructor() { }

  get(): Observable<Node[]> {
    return of([
      {
        id: 1,
        name: 'Vien Nguyen',
        job: 'general manager',
        img: '',
        children: [
          { id: 2,
            name: 'Son Nguyen',
            job: 'department manager',
            img: '',
            children: [
              { id: 3, name: 'Long Le Luoi', job: 'Linh danh thue', img: ''},
              { id: 4, name: 'Tin Khoc Nhe', job: 'Linh danh thue', img: ''},
              { id: 5, name: 'Luong Leo Cong Nha', job: 'Linh danh thue ', img: ''},
            ] },
        ],
      },
    ]);
  }
}
