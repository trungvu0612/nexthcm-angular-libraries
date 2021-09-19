import { CommonStatus } from '@nexthcm/cdk';

export interface BaseTenant {
  id: string;
  tenantCode: string;
  shortname: string;
  tenantName: string;
  state: number;
  email: string;
  phone: string;
  website: string;
}

export interface Tenant extends BaseTenant {
  username: string;
  tax: string;
  addresses: TenantAddresses;
  domains: TenantDomain[];
  addressId: string;
  hasLDAPUser: boolean;
}

export interface TenantAddresses {
  address1: string;
  address2: string;
  countryId: string;
  cityId: string;
  districtId: string;
}

export interface TenantDomain {
  id: string;
  domainUrl: string;
  status: CommonStatus;
  name: string;
  statusBoolean: boolean;
}

export interface OrganizationalUnit {
  id: string;
  orgType: string;
  orgName: string;
  description: string;
  ancestor: OrganizationalUnitAncestor;
  descendants: Partial<OrganizationalUnit>[];
}

export interface OrganizationalUnitAncestor {
  id: string;
  orgName: string;
}
