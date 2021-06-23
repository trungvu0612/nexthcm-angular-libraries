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
  startTime?:  TuiDay,
  endTime?:  TuiDay,
  partialDays?: number | undefined,
}

export interface Duration {
  id?: string;
}

export interface LeaveType {
  id?: string;
}

export interface PartialDays {
  id?: number;
  name?: string;

}

export interface durationValues {
  id?: number;
  name?: string;
  idPartial?: string;
}


