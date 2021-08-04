import { BaseRequest } from './base-request';

export interface LeaveRequest extends BaseRequest {
  leaveType: LeaveRequestLeaveType;
  items: unknown[];
  durationInDay: number;
  status: number;
  employeeDTO: LeaveRequestEmployeeDTO;
  escalateDTO: LeaveRequestEscalateDTO;
  dateRange?: string;
}

export interface LeaveRequestLeaveType {
  id: string;
  name: string;
  description: string;
  processId: string;
  status: number;
  orgId: string;
}

export interface LeaveRequestEmployeeDTOOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface LeaveRequestEmployeeDTOOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface LeaveRequestEmployeeDTOOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: LeaveRequestEmployeeDTOOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: LeaveRequestEmployeeDTOOrgTenant;
}

export interface LeaveRequestEmployeeDTOTitle {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  name: string;
  description: string;
  hasLevel: boolean;
  state: number;
}

export interface LeaveRequestEmployeeDTOProfile {
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

export interface LeaveRequestEmployeeDTOReportToTitle {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  name: string;
  hasLevel: boolean;
  state: number;
}

export interface LeaveRequestEmployeeDTOReportToProfile {
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

export interface LeaveRequestEmployeeDTOReportToReportToProfile {
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

export interface LeaveRequestEmployeeDTOReportToReportToOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: unknown;
  longitude: number;
  latitude: number;
}

export interface LeaveRequestEmployeeDTOReportToReportTo {
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
  profile: LeaveRequestEmployeeDTOReportToReportToProfile;
  office: LeaveRequestEmployeeDTOReportToReportToOffice;
  descendants: unknown[];
}

export interface LeaveRequestEmployeeDTOReportToOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: unknown;
  longitude: number;
  latitude: number;
}

export interface LeaveRequestEmployeeDTOReportTo {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  tenantId: string;
  state: number;
  username: string;
  code: string;
  registerType: string;
  profileType: string;
  registration: number;
  title: LeaveRequestEmployeeDTOReportToTitle;
  profile: LeaveRequestEmployeeDTOReportToProfile;
  reportTo: LeaveRequestEmployeeDTOReportToReportTo;
  office: LeaveRequestEmployeeDTOReportToOffice;
  descendants: unknown[];
}

export interface LeaveRequestEmployeeDTOOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: unknown;
  longitude: number;
  latitude: number;
}

export interface LeaveRequestEmployeeDTO {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  tenantId: string;
  state: number;
  username: string;
  code: string;
  registerType: string;
  profileType: string;
  registration: number;
  org: LeaveRequestEmployeeDTOOrg;
  title: LeaveRequestEmployeeDTOTitle;
  profile: LeaveRequestEmployeeDTOProfile;
  reportTo: LeaveRequestEmployeeDTOReportTo;
  office: LeaveRequestEmployeeDTOOffice;
  descendants: unknown[];
}

export interface LeaveRequestEscalateDTOOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface LeaveRequestEscalateDTOOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface LeaveRequestEscalateDTOOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: LeaveRequestEscalateDTOOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: LeaveRequestEscalateDTOOrgTenant;
}

export interface LeaveRequestEscalateDTOTitle {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  name: string;
  hasLevel: boolean;
  state: number;
}

export interface LeaveRequestEscalateDTOProfile {
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

export interface LeaveRequestEscalateDTOReportToProfile {
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

export interface LeaveRequestEscalateDTOReportToOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: unknown;
  longitude: number;
  latitude: number;
}

export interface LeaveRequestEscalateDTOReportTo {
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
  profile: LeaveRequestEscalateDTOReportToProfile;
  office: LeaveRequestEscalateDTOReportToOffice;
  descendants: unknown[];
}

export interface LeaveRequestEscalateDTOOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: unknown;
  longitude: number;
  latitude: number;
}

export interface LeaveRequestEscalateDTO {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  tenantId: string;
  state: number;
  username: string;
  code: string;
  registerType: string;
  profileType: string;
  registration: number;
  org: LeaveRequestEscalateDTOOrg;
  title: LeaveRequestEscalateDTOTitle;
  profile: LeaveRequestEscalateDTOProfile;
  reportTo: LeaveRequestEscalateDTOReportTo;
  office: LeaveRequestEscalateDTOOffice;
  descendants: unknown[];
}
