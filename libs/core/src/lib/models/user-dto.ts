export interface Title {
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

export interface Level {
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

export interface Profile {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  userId: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDay: any;
  image: string;
  maritalStatus: number;
  major: string;
  salary: number;
}

export interface ReportTo {
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
  officeId: string;
  assigned: boolean;
  descendants: any[];
}

export interface Contact {
  phone: string;
  id: string;
  contactType: string;
}

export interface Address {
  address1: string;
  address2: string;
  id: string;
}

export interface UserDto {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  tenantId: string;
  state: any;
  username: string;
  code: string;
  registerType: string;
  registration: any;
  title: Title;
  level: Level;
  profile: Profile;
  reportTo: ReportTo;
  officeId: string;
  assigned: boolean;
  descendants: any[];
  contact: Contact;
  address: Address;
}

export interface SearchEmployee {
  filter: string;
}
