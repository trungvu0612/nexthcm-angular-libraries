import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  DEFAULT_PAGINATION_DATA,
  Office,
  OfficesService,
  Pagination,
  PagingResponse,
} from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { OfficeWifiDevicesInfo } from '../models/office-wifi-devices-info';
import { WifiDevice } from '../models/wifi-device';

@Injectable()
export class AdminOfficesService {
  constructor(private readonly http: HttpClient, private readonly officesService: OfficesService) {}

  upsertOffice(payload: Office): Observable<unknown> {
    return (payload.id ? this.officesService.editOffice(payload) : this.createOffice(payload)).pipe(
      tap(() => {
        this.officesService.doRefreshOffices();
        if (payload.onsite) {
          this.officesService.doRefreshOnsiteOffices();
        }
      })
    );
  }

  createOffice(payload: Office): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/offices`, payload);
  }

  deleteOffice(office: Office): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/offices/${office.id}`).pipe(
      tap(() => {
        this.officesService.doRefreshOffices();
        if (office.onsite) {
          this.officesService.doRefreshOnsiteOffices();
        }
      })
    );
  }

  getNetworkDevicesOfOfficesInfo(params: HttpParams): Observable<Pagination<OfficeWifiDevicesInfo>> {
    return this.http
      .get<PagingResponse<OfficeWifiDevicesInfo>>(`${ACCOUNT_API_PATH}/networks/offices/statistics`, { params })
      .pipe(
        map((res) => res.data),
        catchError(() => of(DEFAULT_PAGINATION_DATA))
      );
  }

  getNetworkDevicesByOfficeId(officeId: string, params: HttpParams): Observable<Pagination<WifiDevice>> {
    return this.http
      .get<PagingResponse<WifiDevice>>(`${ACCOUNT_API_PATH}/offices/${officeId}/networks`, { params })
      .pipe(
        map((res) => res.data),
        catchError(() => of(DEFAULT_PAGINATION_DATA))
      );
  }

  upsertNetworkDevice(payload: WifiDevice): Observable<unknown> {
    return payload.id ? this.editNetworkDevice(payload) : this.createNetworkDevice(payload);
  }

  createNetworkDevice(payload: WifiDevice): Observable<unknown> {
    return this.http.post(`${ACCOUNT_API_PATH}/networks`, payload);
  }

  editNetworkDevice(payload: WifiDevice): Observable<unknown> {
    return this.http.put(`${ACCOUNT_API_PATH}/networks/${payload.id}`, payload);
  }

  deleteNetworkDevice(deviceId: string): Observable<unknown> {
    return this.http.delete(`${ACCOUNT_API_PATH}/networks/${deviceId}`);
  }
}
