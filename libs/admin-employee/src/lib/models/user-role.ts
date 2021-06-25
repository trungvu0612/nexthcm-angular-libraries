export interface Member {
  id: string;
  type: string;
  state: number;
}

export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface Org {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: Member;
  orgType: string;
  orgName: string;
  code: string;
  tenant: Tenant;
}

export interface Tenant {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface UserRole {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  state: number;
  name: string;
  description: string;
  code: string;
  org: Org;
  tenant: Tenant;
}
