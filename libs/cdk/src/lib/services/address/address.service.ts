import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address, BaseResponse, PUBLIC_API_PATH } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AddressState {
  countries: Address[];
}

@Injectable()
export class AddressService extends RxState<AddressState> {
  constructor(private http: HttpClient) {
    super();
    this.connect('countries', this.getPlaces());
  }

  getPlaces(parentId?: string): Observable<Address[]> {
    return this.http
      .get<BaseResponse<Address[]>>(`${PUBLIC_API_PATH}/address`, { params: { uuid: parentId || '' } })
      .pipe(map((response) => response.data));
  }
}
