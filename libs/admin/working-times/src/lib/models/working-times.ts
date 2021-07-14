export const WORKING_TIMES = [
  { value: '32400', name: '09:00' },
  { value: '36000', name: '10:00' },
  { value: '39600', name: '11:00' },
  { value: '43200', name: '12:00' },
  { value: '46800', name: '13:00' },
  { value: '50400', name: '14:00' },
  { value: '54000', name: '15:00' },
  { value: '57600', name: '16:00' },
  { value: '61200', name: '17:00' },
  { value: '64800', name: '18:00' }
];

export interface Weekday {
  id: string;
  status: number;
  name: string;
  number: number;
}

export interface Values {
  from: number;
  to: number;
  workShift: boolean;
}

export interface Items {
  id: string;
  weekday: Weekday;
  configType: number;
  values: Values[];
  totalTime: number;
}

export interface WorkingTimes {
  id: string;
  configName: string;
  orgId: string;
  minStart: number;
  maxStart: number;
  maxCheckin: number;
  minCheckout: number;
  minWorkingTimeHours: number;
  workingTimeHours: number;
  items: Items[];
}
