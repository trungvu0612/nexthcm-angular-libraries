import { TuiDay } from '@taiga-ui/cdk';

export interface Requests {
  id?: string;
  type: string;
  userId: string;
  state: number;
  assignedName: string;
  fromDate: number;
  toDate: number;
  duration?: Duration;
  sendTo?: Employee;
  reason: string;
}

export interface Duration {
  id: string;
}

export interface Employee {
  id: string;
}

export interface SearchRequest {
  fromDate?: number | null | TuiDay | string;
  toDate?: number | null | TuiDay | string;
}
