import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address, BaseResponse, PUBLIC_API_PATH } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private http: HttpClient) {}

  getPlaces(parentId?: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${PUBLIC_API_PATH}/address`, { params: { uuid: parentId || '' } });
  }

  getAddress(id: string): Observable<Address> {
    return this.http
      .get<BaseResponse<Address>>(`${PUBLIC_API_PATH}/address/${id}`)
      .pipe(map((response) => response.data));
  }
}
