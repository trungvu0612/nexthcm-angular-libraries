import { TuiDay, TuiTime } from '@taiga-ui/cdk';

export interface Requests {
  id?: string;
  type?: string;
  userId?: string;
  state?: number;
  status?: number;
  assignedName?: string;
  fromDate?: number;
  toDate?: number;
  lastModifiedDate?: Date;
  duration?: Duration;
  sendTo?: Employee;
  comments?: string;
  comment?: string;
  reason?: string;
  length?: string;
  userSendTo?: UserSendTo;
  employeeDTO?: RequestsEmployeeDTO;
  leaveType?: LeaveProfile;
  durationInDay?: string;
}

export interface LeaveProfile {
  name: string;
}

export interface RequestsEmployeeDTO {
  profile: RequestsEmployeeDTOProfile;
  office: RequestsOffice;
  reportTo: ReportProfile;
}

export interface ReportProfile {
  username: string;
  reportTo: ProfileLeaveInfo;
}

export interface ProfileLeaveInfo {
  profile: ProfileLeave;
}

export interface ProfileLeave {
  fullName: string;
}

export interface RequestsOffice {
  name: string;
}

export interface RequestsEmployeeDTOProfile {
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

export interface UserSendTo {
  username?: string;
  office?: Office;
}

export interface Office {
  name?: string;
}

export interface TimeSheetUpdateReq extends Requests {
  newInTime: number | string;
  newOutTime: number | string;
  oldInTime: number | string;
  oldOutTime: number | string;
  updateTotalTime: number;
  timeSheetTracking: TimeSheetTracking;
  emailCc: string;
}

export interface TimeSheetTracking {
  id: string;
  trackingDate: number;
  inTime: number | string;
  outTime: number | string;
}

export interface Duration {
  id: string;
}

export interface Employee {
  id: string;
}

export interface SearchRequest {
  fromDate?: number | Date | TuiDay | string;
  toDate?: number | Date | TuiDay | string;
}

export interface SubmitRequest {
  userId?: string;
  fromDate?: number | Date | TuiDay;
  toDate?: number | Date | TuiDay;
  duration?: TuiTime;
  sendTo?: string;
  comment?: string;
  reason?: string;
}
