export interface Requests {
  id?: string;
  type: string;
  userId: string;
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
  type: string;
}
