import { HttpClient } from '@angular/common/http';
import { Address, BaseResponse, PUBLIC_API_PATH } from '@nexthcm/cdk';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AddressService {
  constructor(private http: HttpClient) {}

  getPlaces(parendId?: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${PUBLIC_API_PATH}/address`, { params: { uuid: parendId || '' } });
  }

  getAddress(id: string): Observable<Address> {
    return this.http
      .get<BaseResponse<Address>>('/publicapp/v1.0/address/' + id)
      .pipe(map((response) => response.data));
  }
}
