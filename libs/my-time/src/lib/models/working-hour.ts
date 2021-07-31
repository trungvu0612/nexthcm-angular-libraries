export interface WorkingHour {
	id: string;
	trackingDate: number;
	inTime: number;
	outTime: number;
	checkinFrom: string;
	checkoutFrom: string;
	lastAction: string;
	userId: string;
	lastModifiedDate: number;
	day: string;
	totalWorkingTime: number;
	workingDay: number;
	userInfo: WorkingHourUserInfo;
	ot: number;
	wfh: number;
	onsiteDay: number;
	leave: WorkingHourLeave;
	inTimeToFullTime: string;
	outTimeToFulltime: string;
}
export interface WorkingHourUserInfoOrgMember {
	id: string;
	type: string;
	state: number;
}
export interface WorkingHourUserInfoOrgTenant {
	createdDate: number;
	lastModifiedDate: number;
	optCounter: number;
	id: string;
	tenantCode: string;
	tenantName: string;
	state: number;
}
export interface WorkingHourUserInfoOrg {
	createdDate: number;
	lastModifiedDate: number;
	optCounter: number;
	id: string;
	state: number;
	member: WorkingHourUserInfoOrgMember;
	orgType: string;
	orgName: string;
	code: string;
	tenant: WorkingHourUserInfoOrgTenant;
}
export interface WorkingHourUserInfoProfile {
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
export interface WorkingHourUserInfoOffice {
	id: string;
	name: string;
	status: number;
	address: string;
	description?: any;
	longitude: number;
	latitude: number;
}
export interface WorkingHourUserInfo {
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
	org: WorkingHourUserInfoOrg;
	profile: WorkingHourUserInfoProfile;
	office: WorkingHourUserInfoOffice;
	descendants: any[];
}
export interface WorkingHourLeaveLeaveType {
	id: string;
	name: string;
	description: string;
	processId: string;
	status: number;
	orgId: string;
}
export interface WorkingHourLeave {
	id: string;
	leaveType: WorkingHourLeaveLeaveType;
	fromDate: number;
	toDate: number;
	comment: string;
	items: any[];
	duration: number;
	status: number;
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
  status: 0;
}
