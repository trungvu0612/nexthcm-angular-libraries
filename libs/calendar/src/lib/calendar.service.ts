import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Holiday, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarBuilding, ExternalEmail, InvitePerson } from './models/calendar';

interface CalendarState {
  buildings: CalendarBuilding[];
  rooms: CalendarBuilding[];
  invitePeople: InvitePerson[];
  externalEmails: ExternalEmail[];
  holidays: Holiday[];
}

@Injectable()
export class CalendarService extends RxState<CalendarState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('holidays', this.getHoliday());
    this.connect('buildings', this.getBuildings());
    this.connect('rooms', this.getRooms());
    this.connect('invitePeople', this.getPeople());
    this.connect('externalEmails', this.getExternalEmails());
  }

  getBuildings(): Observable<CalendarBuilding[]> {
    return of([
      {
        id: '1',
        image: 'assets/icons/bulding.svg',
        name: 'Copac Square',
        address: '12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: '2',
        image: 'assets/icons/building.svg',
        name: 'Van Phuc City',
        address: '9th St., Van Phuc City, Hiep Binh Phuoc Ward, Thu Duc Dist., HCMC, Vietnam',
      },
    ]);
  }

  getRooms(): Observable<CalendarBuilding[]> {
    return of([
      {
        id: '1',
        image: 'assets/icons/bulding.svg',
        name: 'Techguru',
        address: 'Floor 2, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: '2',
        image: 'assets/icons/building.svg',
        name: 'Incubation',
        address: 'Floor 2, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
      {
        id: '3',
        image: 'assets/icons/building.svg',
        name: 'Room 4',
        address: 'Floor 3, Block B, Copac Square Building, 12 Ton Dan St., Dist 4., HCMC, Vietnam',
      },
    ]);
  }

  getPeople(): Observable<InvitePerson[]> {
    return of([
      { id: '1', image: 'assets/icons/people.svg', name: 'Le Tuan Vu', position: 'Software Developer' },
      { id: '2', image: 'assets/icons/people.svg', name: 'Bui Tuan Si', position: 'QA Manager' },
    ]);
  }

  getExternalEmails(): Observable<ExternalEmail[]> {
    return of([
      { id: '1', name: 'tran.ngo-nam@gmail.com' },
      { id: '2', name: 'nguyen.tran-thao@gmail.com' },
    ]);
  }

  getHoliday(): Observable<Holiday[]> {
    return this.http.get<PagingResponse<Holiday>>(`${MY_TIME_API_PATH}/holidays`).pipe(map((res) => res.data.items));
  }
}
