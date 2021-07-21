export interface Member {
  id: string;
  type: string;
  state: number;
}

export interface Tenant {
  createdDate: number;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface Office {
  createdDate: number;
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
