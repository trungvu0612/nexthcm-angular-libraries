export interface BranchData {
  checked?: boolean;
  orgId: string;
  orgType: string;
  name: string;
  creator: string;
  description: string;
  address: string;
  edit?: boolean;
  delete?: boolean;
}

export interface Branch {
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

export interface BranchList {
  orgId?: string;
  orgName: string;
  orgType: string;
  description?: string;
  user: User;
}

export interface User {
  id: string;
}

export interface BranchRes {
  createdDate: number,
  createdBy: string,
  lastModifiedDate: number,
  lastModifiedBy: string,
  optCounter: number,
  id: string,
  state: number,
  orgType: string,
  orgName: string,
  code: string,
  description: string,
}
