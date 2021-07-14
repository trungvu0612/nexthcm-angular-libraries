import { Address, UserDto, ContactDTO } from '@nexthcm/core';

export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  id: string;
  user: UserDto;
  tenantCode: string;
  tenantName: string;
  state: number;
  image: string;
  tax: string;
  contacts: ContactDTO;
  addresses: Address;
}

export interface Domain {
  id: string;
  tenant: Tenant;
  domainUrl: string;
  image: string;
}

export interface OrganizationalLevel {
  id: string;
}

export interface OrganizationalUnit {
  id: string;
}
