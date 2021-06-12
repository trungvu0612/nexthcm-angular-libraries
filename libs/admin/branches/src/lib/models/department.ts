export interface Department {
  createdDate?: number;
  id: string;
  lastModifiedDate?: number;
  member?: Member;
  optCounter?: number;
  orgName: string;
  orgType: string;
  state?: number;
  tenant: Tenant;
  mbrList: [];
}

export interface Member {
  id: string;
  type: string;
  state: number;
}

export interface Tenant {
  createdDate: number;
  id: string;
  lastModifiedDate: number;
  optCounter: number;
  state: number;
  tenantCode: string;
  tenantName: string;
}

export interface DepartmentList {
  orgId?: string;
  orgName: string;
  orgType: string;
  description?: string;
  user: User;
}

export interface User {
  id: string;
}
