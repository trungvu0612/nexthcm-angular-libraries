export interface Requests {
  id: string;
  type: string;
  userId: string;
  fromDate: string;
  toDate: string;
  duration: Duration;
  sendTo: Employee;
  reason: string;
}

export interface Duration {
  id: string;
}

export interface Employee {
  id: string;
}
