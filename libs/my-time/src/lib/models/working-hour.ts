export interface Member {
  id: string;
  type: string;
  state: number;
}

export interface Tenant {
  createdDate: number;
  createdBy: string;
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

export interface Profile {
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
  optCounter: number;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  image: string;
  maritalStatus: number;
}

export interface Office {
  id: string;
  name: string;
  status: number;
  address: string;
  description?: any;
  longitude: number;
  latitude: number;
}

export interface UserInfo {
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
  registration: number;
  languageId: string;
  org: Org;
  profile: Profile;
  office: Office;
  descendants: any[];
}

export interface WorkingHour {
  id: string;
  trackingDate: number;
  inTime: number;
  outTime: number;
  checkinFrom: string;
  checkoutFrom: string;
  lastAction: string;
  device: string;
  ip: string;
  userId: string;
  lastModifiedDate: number;
  day: string;
  totalWorkingTime: number;
  workingDay: number;
  userInfo: UserInfo;
  onsiteDay: number;
}

export interface SearchWorkingHour {
  name: string;
}

export interface RequestUpdateTime {
  timeSheetId: string;
  createdDate: string;
  sendTo: string;
  newInTime: string;
  newOutTime: string;
  comments: string;
  status: 0
}
