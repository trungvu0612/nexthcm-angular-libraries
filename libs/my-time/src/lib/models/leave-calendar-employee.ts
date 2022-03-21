import { LeaveRequest } from './leave-request';

export interface LeaveCalendarEmployee {
  user: {
    id: string;
    cif: string;
    fullName: string;
  };
  leaves: {
    [d: string]: LeaveRequest[];
  };
}
