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
  domains: Domain;
}

export interface Domain {
  domainUrl: string;
  status: string;
  name: string;
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
  fullName: string;
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

export interface ContactDTO {
  phone: string;
  id: string;
  contactType: string;
  email: string;
  skype: string;
  facebook: string;
  instagram: string;
  website: string;
}

export interface Address {
  createdDate: number;
  lastModifiedDate: number;
  optCounter: number;
  id: string;
  status: number;
  type: string;
  name: string;
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
  contact: ContactDTO;
  address: Address;
  fullName?: string;
}
