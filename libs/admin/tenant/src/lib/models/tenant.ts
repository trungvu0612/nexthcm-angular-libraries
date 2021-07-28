import { Address, ContactDTO, UserDto } from '@nexthcm/core';

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
  contacts: ContactDTO | ContactDTO[];
  addresses: Address | Address[];
}

export interface Domain {
  id: string;
  tenant: Partial<Tenant>;
  domainUrl: string;
  image: string;
}

export interface OrganizationalLevel {
  id: string;
  orgType: string;
  orgTypeLabel: string;
  tenant: Tenant;
  parentOrgTypeLabel: OrganizationalLevel;
}

export interface OrganizationalUnit {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  state: number;
  orgType: string;
  orgName: string;
  code: string;
  description: string;
  tenant: Tenant;
  descendants: OrganizationalUnit[];
}

export interface OrganizationalUnitForm {
  id: string;
  orgName: string;
  orgType: string;
  description: string;
  ancestor: { id: string };
  user: { id: string };
}
