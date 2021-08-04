export interface BaseRequest {
  id: string;
  fromDate: number;
  toDate: number;
  duration: number;
  comment: string;
}

export interface BaseRequestSendToUserOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface BaseRequestSendToUserOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface BaseRequestSendToUserOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: BaseRequestSendToUserOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: BaseRequestSendToUserOrgTenant;
}

export interface BaseRequestSendToUserProfile {
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

export interface BaseRequestSendToUserOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: any;
  longitude: number;
  latitude: number;
}

export interface BaseRequestSendToUser {
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
  org: BaseRequestSendToUserOrg;
  profile: BaseRequestSendToUserProfile;
  office: BaseRequestSendToUserOffice;
  descendants: any[];
}

export interface BaseRequestUserOrgMember {
  id: string;
  type: string;
  state: number;
}

export interface BaseRequestUserOrgTenant {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  tenantCode: string;
  tenantName: string;
  state: number;
}

export interface BaseRequestUserOrg {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  state: number;
  member: BaseRequestUserOrgMember;
  orgType: string;
  orgName: string;
  code: string;
  tenant: BaseRequestUserOrgTenant;
}

export interface BaseRequestUserProfile {
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

export interface BaseRequestUserOffice {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: any;
  longitude: number;
  latitude: number;
}

export interface BaseRequestUser {
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
  org: BaseRequestUserOrg;
  profile: BaseRequestUserProfile;
  office: BaseRequestUserOffice;
  descendants: any[];
}
