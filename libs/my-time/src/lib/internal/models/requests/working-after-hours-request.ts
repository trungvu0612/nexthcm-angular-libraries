import { EmployeeInfo } from '@nexthcm/cdk';
import { BaseRequest } from './base-request';

export interface WorkingAfterHoursRequest extends BaseRequest {
  fromDate: number;
  toDate: number;
  optCounter: number;
  duration: number;
  type: string;
  reason: string;
  sendToUser: WorkingAfterHoursRequestSendToUser;
  user: EmployeeInfo;
}

export interface WorkingAfterHoursRequestSendToUserOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface WorkingAfterHoursRequestSendToUserOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface WorkingAfterHoursRequestSendToUserOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: WorkingAfterHoursRequestSendToUserOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: WorkingAfterHoursRequestSendToUserOrgTenant;
}

export interface WorkingAfterHoursRequestSendToUserProfile {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface WorkingAfterHoursRequestSendToUserOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: string;
  longitude: number;
  latitude: number;
}

export interface WorkingAfterHoursRequestSendToUser {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantId: string;
  state: number;
  username: string;
  code: string;
  registerType: string;
  registration: number;
  org: WorkingAfterHoursRequestSendToUserOrg;
  profile: WorkingAfterHoursRequestSendToUserProfile;
  office: WorkingAfterHoursRequestSendToUserOffice;
  descendants: unknown[];
}

export interface WorkingAfterHoursRequestUserOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface WorkingAfterHoursRequestUserOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface WorkingAfterHoursRequestUserOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: WorkingAfterHoursRequestUserOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: WorkingAfterHoursRequestUserOrgTenant;
}
