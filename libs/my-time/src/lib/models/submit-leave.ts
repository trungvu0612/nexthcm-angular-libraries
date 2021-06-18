import { TuiDay } from '@taiga-ui/cdk';

export interface SubmitLeave {
  id: number;
  image: string;
  name: string;
}

export interface LeaveSubmit{
  status? : number,
  comments?: string,
  leaveType?: LeaveType,
  sendTo?: string,
  duration?: Duration,
  startTime?: string | TuiDay,
  endTime?: string | TuiDay,
}

export interface Duration {
  id?: string;
}

export interface LeaveType {
  id?: string;
}
