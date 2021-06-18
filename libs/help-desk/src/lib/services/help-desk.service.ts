import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zone } from '@nexthcm/ui';
import { Observable, of } from 'rxjs';
import { CalendarBuilding, ExternalEmail, PeopleInvite } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HelpDeskService {
  constructor(private http: HttpClient) {}

  getMySeatMap(): Observable<Partial<Zone>> {
    return this.http.get<Partial<Zone>>('/mytimeapp/v1.0/my-seats-map');
  }

  get(): Observable<CalendarBuilding[]> {
    return of([
      {
        id: 1,
        image: 'assets/icons/bulding.svg',
        name: 'Copac Square',
        address: '12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: 2,
        image: 'assets/icons/building.svg',
        name: 'Van Phuc City',
        address: '9th St., Van Phuc City, Hiep Binh Phuoc Ward, Thu Duc Dist., HCMC, Vietnam',
      },
    ]);
  }

  getRoom(): Observable<CalendarBuilding[]> {
    return of([
      {
        id: 1,
        image: 'assets/icons/bulding.svg',
        name: 'Techguru',
        address: 'Floor 2, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: 2,
        image: 'assets/icons/building.svg',
        name: 'Incubation',
        address: 'Floor 2, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: 3,
        image: 'assets/icons/building.svg',
        name: 'Room 4',
        address: 'Floor 3, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
    ]);
  }

  getPeople(): Observable<PeopleInvite[]> {
    return of([
      { id: 1, image: 'assets/icons/people.svg', name: 'Le Tuan Vu', position: 'Software Developer' },
      { id: 2, image: 'assets/icons/people.svg', name: 'Bui Tuan Si', position: 'QA Manager' },
    ]);
  }

  getEmail(): Observable<ExternalEmail[]> {
    return of([
      { id: 1, name: 'tran.ngo-nam@gmail.com' },
      { id: 2, name: 'nguyen.tran-thao@gmail.com' },
    ]);
  }
}
