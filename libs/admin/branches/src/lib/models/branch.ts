import { Zone } from '@nexthcm/core';

export interface BranchPost {
  orgType: string;
  orgName: string;
  description: string;
  user: Member;
  offices: Partial<Zone>[] | null;
}

export interface BranchList {
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
