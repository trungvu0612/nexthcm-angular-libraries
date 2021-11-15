import { EmployeeInfo } from '@nexthcm/cdk';

export interface BaseWorkingHours {
  userId: string;
  totalWorkingTime: number;
  workingDay: number;
  userInfo?: EmployeeInfo;
  ot: number;
  wfh: number;
  onsiteDay: number;
}

export interface WorkingHoursGroup extends BaseWorkingHours {
  countLeave: number;
}
