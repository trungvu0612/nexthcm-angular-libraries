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

export interface JobLevel {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  org: Org;
  name: string;
  description: string;
  status: number;
}
