import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Permission, ServiceInfo } from '../models/permission';

const PERMISSION = {
  id: 'e55d1s',
  name: 'Permission 1',
  description: 'Description 1',
  services: [
    {
      service: {
        id: '123',
        name: 'Access Analyzer',
        description: 'Lorem ipsum dolor sit amet.',
      },
    },
  ],
};

const SERVICES_INFO = [
  {
    id: '123',
    name: 'Access Analyzer',
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: '123',
    name: 'Account',
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: '123',
    name: 'Activate',
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: '123',
    name: 'AMP',
    description: 'Lorem ipsum dolor sit amet.',
  },
  {
    id: '123',
    name: 'Amplify',
    description: 'Lorem ipsum dolor sit amet.',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AdminPermissionsService {
  constructor() {}

  getPermissions(): Observable<Permission[]> {
    return of(Array(10).fill(PERMISSION));
  }

  getServicesInfo(): Observable<ServiceInfo[]> {
    return of(SERVICES_INFO);
  }
}
