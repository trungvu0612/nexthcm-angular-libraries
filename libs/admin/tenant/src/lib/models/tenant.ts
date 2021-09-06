import { Address } from '@nexthcm/cdk';

export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
  image: string;
  tax: string;
  addresses: Address;
  shortname: string;
  username: string;
  hasLDAPUser: boolean;
  domains: Domain[];
}

export interface Domain {
  id?: string;
  tenant: Partial<Tenant>;
  domainUrl: string;
  name: string;
  image: string;
  status: string;
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
  id?: string | undefined;
  orgName: string | undefined;
  orgType: string | undefined;
  description: string | undefined;
  ancestor: { id?: string | undefined };
  user: { id?: string | undefined };
}



