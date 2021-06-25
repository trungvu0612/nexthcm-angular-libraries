import { TuiDay } from '@taiga-ui/cdk';

// export interface SubmitLeave {
//   id: number;
//   image: string;
//   name: string;
// }

export interface LeaveSubmit{
  durationHold?: number;
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
  value?: number;
  label?: string;

}

export interface durationValues {
  value?: number;
  label?: string;
  idPartial?: string;
}


