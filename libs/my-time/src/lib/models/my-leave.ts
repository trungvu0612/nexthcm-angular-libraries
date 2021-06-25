import { LeaveType } from './leave-type';

export interface MyLeave extends LeaveType {
  id: string;
  date?: Date;
  leaveType?: LeaveType;
  days?: number;
  status: number;
  comments: string;
  sendTo: string;
  startTime: string;
  endTime: string;
  userId: string;
}

export interface LeaveRes {
  id?: string;
  lengthHours?: number;
  lengthDays?: LeaveType;
  status?: number;
  comments: string;
  userId: string;
  leaveType?: LeaveType;
  duration?: any;
  leaveRequest?: any;
}
