import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrgRes } from '../../models/node';

@Injectable({
  providedIn: 'root'
})
export class HumanResourceService {
  constructor(@Inject(ENVIRONMENT) protected env: Environment, public httpClient: HttpClient) {
  }

  getOrg(id: string): Observable<OrgRes> {
    if (id === undefined || id == '') {
      return this.httpClient
        .get<OrgRes>(this.env.orgUrl + `/accountapp/v1.0/org-chart/`, {})
        .pipe(map((res) => res as OrgRes));
    } else {
      return this.httpClient
        .get<OrgRes>(this.env.orgUrl + `/accountapp/v1.0/org-chart/${id}`, {})
        .pipe(map((res) => res as OrgRes));
    }
  }

  //   get(): Observable<OrgRes> {
  //     return of(
  //       {
  //         createdDate: 1621545019778,
  //         lastModifiedDate: 1621545019778,
  //         optCounter: 0,
  //         id: '9d07f921-81c3-4c2c-a838-e279dc04a80f',
  //         tenant: {
  //           createdDate: 1621394663216,
  //           createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
  //           lastModifiedDate: 1621394663216,
  //           optCounter: 0,
  //           id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
  //           tenantCode: 'TNT-0000002',
  //           tenantName: 'Hieu Nguyen Company',
  //           state: 0
  //         },
  //         username: 'son.nguyen',
  //         registerType: 'R',
  //         descendants: [
  //           {
  //             createdDate: 1621545019805,
  //             lastModifiedDate: 1621545019805,
  //             optCounter: 0,
  //             id: '3452e624-ad89-411d-9118-da6aab92a176',
  //             tenant: {
  //               createdDate: 1621394663216,
  //               createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
  //               lastModifiedDate: 1621394663216,
  //               optCounter: 0,
  //               id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
  //               tenantCode: 'TNT-0000002',
  //               tenantName: 'Hieu Nguyen Company',
  //               state: 0
  //             },
  //             username: 'long.nguyen',
  //             registerType: 'R',
  //             descendants: []
  //           },
  //           {
  //             createdDate: 1621545068749,
  //             lastModifiedDate: 1621545068749,
  //             optCounter: 0,
  //             id: '06874799-0ea6-47a1-8a87-c08daeaa4bb6',
  //             tenant: {
  //               createdDate: 1621394663216,
  //               createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
  //               lastModifiedDate: 1621394663216,
  //               optCounter: 0,
  //               id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
  //               tenantCode: 'TNT-0000002',
  //               tenantName: 'Hieu Nguyen Company',
  //               state: 0
  //             },
  //             username: 'nha.luong',
  //             registerType: 'R',
  //             descendants: []
  //           },
  //           {
  //             createdDate: 1621545068749,
  //             lastModifiedDate: 1621545068749,
  //             optCounter: 0,
  //             id: 'b89293de-671f-403e-b2f8-3d67f84f9b77',
  //             tenant: {
  //               createdDate: 1621394663216,
  //               createdBy: 'e202b659-743a-4bdb-97c7-be246194d07f',
  //               lastModifiedDate: 1621394663216,
  //               optCounter: 0,
  //               id: '352d7794-f165-4f03-97f0-ff7f3d0242e8',
  //               tenantCode: 'TNT-0000002',
  //               tenantName: 'Hieu Nguyen Company',
  //               state: 0
  //             },
  //             username: 'tin.do',
  //             registerType: 'R',
  //             descendants: []
  //           }
  //         ]
  //       }
  //     );
  // }


}
