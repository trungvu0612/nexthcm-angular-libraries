import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeatMap } from '../models';

const SEAT_MAP = {
  building: 'Copac',
  scaleX: 10,
  scaleY: 18,
  rounded: 12,
  seats: [
    {
      id: 1,
      image:
        'https://cdna.artstation.com/p/assets/images/images/027/552/530/large/sterrrcore-art-commission-ilovegus-chibi-bust-final.jpg',
      name: 'BUI THAN',
      dateOfBirth: 1622537413000,
      status: 'Leave',
      team: 'RVC',
      phoneNumber: '0902693533',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      seatNumber: 1,
      positionX: 25,
      positionY: 25,
      scaleX: 5,
      scaleY: 9,
    },
    {
      name: 'BUI THAN',
      dateOfBirth: 1622537413000,
      status: 'Working Outside',
      team: 'RVC',
      phoneNumber: '0902693533',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      id: 2,
      image:
        'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/122225393/original/c27ea6bf48ea75188de749a1766c3a90df822adb/draw-chibi-icon-for-you.jpg',
      positionX: 25,
      positionY: 75,
    },
    {
      name: 'BUI THAN',
      dateOfBirth: 1622537413000,
      status: 'Checked In',
      team: 'RVC',
      phoneNumber: '0902693533',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      id: 3,
      image:
        'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/122225393/original/c27ea6bf48ea75188de749a1766c3a90df822adb/draw-chibi-icon-for-you.jpg',
      positionX: 75,
      positionY: 25,
    },
    {
      name: 'BUI THAN',
      dateOfBirth: 1622537413000,
      status: 'Leave',
      team: 'RVC',
      phoneNumber: '0902693533',
      email: 'vien.nguyen@banvien.com',
      skype: 'vien.nguyen@banvien.com',
      id: 4,
      image: 'https://d9jhi50qo719s.cloudfront.net/dlf/samples/jew_800.png',
      positionX: 75,
      positionY: 75,
    },
    {
      positionX: 50,
      positionY: 50,
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class SeatMapService {
  constructor(private http: HttpClient) {}

  getSeatMapData(): Observable<SeatMap> {
    // this.http.get('/v1.0/my-seats-map').subscribe();
    return of(SEAT_MAP);
  }

  postSeatMapData(body: SeatMap) {
    // this.http.post('/v1.0/seats-map', body).subscribe();
  }
}
