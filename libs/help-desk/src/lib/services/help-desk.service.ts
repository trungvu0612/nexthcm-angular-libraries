import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult, User, Zone } from '@nexthcm/ui';
import { RxState } from '@rx-angular/state';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarBuilding, ExternalEmail, PeopleInvite } from '../models';

interface HelpDesk {
  users: Partial<User>[];
  seatMaps: Partial<Zone>[];
}

@Injectable()
export class HelpDeskService extends RxState<HelpDesk> {
  constructor(private http: HttpClient) {
    super();
    this.connect('users', this.getUsers());
    this.connect('seatMaps', this.getSeatMaps());
  }

  getUsers(): Observable<Partial<User>[]> {
    return this.http
      .get<ResponseResult<User>>('/accountapp/v1.0/users', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMaps(): Observable<Partial<Zone>[]> {
    return this.http
      .get<ResponseResult<Zone>>('/mytimeapp/v1.0/seats-map', { params: { size: 999 } })
      .pipe(map((response) => response.data.items));
  }

  getSeatMap(id?: string): Observable<Partial<Zone>> {
    const path = id ? '/seats-map/' + id : '/my-seats-map';
    return this.http.get<Partial<Zone>>('/mytimeapp/v1.0' + path);
  }

  updateAssignedUser(seatId: string, body: any): Observable<any> {
    return this.http.put('/mytimeapp/v1.0/seats-map/assign-seat/' + seatId, body);
  }

  getBuildings(): Observable<CalendarBuilding[]> {
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
