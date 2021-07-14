import { ContactDTO, User } from '@nexthcm/core';

export interface Address {
  address1: string;
  address2: string;
  address3: string;
  countryId: string;
  state: string;
  city: string;
  postalCode: number;
  zipCode: number;
}

export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  id: string;
  user: User;
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
