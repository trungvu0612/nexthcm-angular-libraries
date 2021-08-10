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
	cif: string;
	registerType: string;
	registration: number;
	org: WorkingHourUserInfoOrg;
	office: WorkingHourUserInfoOffice;
	descendants: any[];
	fullName: string;
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
  search: string | null;
  month: number | null;
  year: number | null;
  week: WeekInfo | null;
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


export interface WeekInfo {
	week: number;
	weekStart: number;
	weekEnd: number;
  }
  