export const WORKING_TIMES = [
  { value: '28800', name: '08:00' },
  { value: '29700', name: '08:15' },
  { value: '30600', name: '08:30' },
  { value: '31500', name: '08:45' },
  { value: '32400', name: '09:00' },
  { value: '33300', name: '09:15' },
  { value: '34200', name: '09:30' },
  { value: '35100', name: '09:45' },
  { value: '36000', name: '10:00' },
  { value: '36900', name: '10:15' },
  { value: '37800', name: '10:30' },
  { value: '38700', name: '10:45' },
  { value: '39600', name: '11:00' },
  { value: '40500', name: '11:15' },
  { value: '41400', name: '11:30' },
  { value: '42300', name: '11:45' },
  { value: '43200', name: '12:00' },
  { value: '44100', name: '12:15' },
  { value: '45000', name: '12:30' },
  { value: '45900', name: '12:45' },
  { value: '46800', name: '13:00' },
  { value: '47700', name: '13:15' },
  { value: '48600', name: '13:30' },
  { value: '49500', name: '13:45' },
  { value: '50400', name: '14:00' },
  { value: '51300', name: '14:15' },
  { value: '52200', name: '14:30' },
  { value: '53100', name: '14:45' },
  { value: '54000', name: '15:00' },
  { value: '54900', name: '15:15' },
  { value: '55800', name: '15:30' },
  { value: '56700', name: '15:45' },
  { value: '57600', name: '16:00' },
  { value: '58500', name: '16:15' },
  { value: '59400', name: '16:30' },
  { value: '60300', name: '16:45' },
  { value: '61200', name: '17:00' },
  { value: '62100', name: '17:15' },
  { value: '63000', name: '17:30' },
  { value: '63900', name: '17:45' },
  { value: '64800', name: '18:00' },
  { value: '65700', name: '18:15' },
  { value: '66600', name: '18:30' },
  { value: '67500', name: '18:45' },
  { value: '68400', name: '19:00' },
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
