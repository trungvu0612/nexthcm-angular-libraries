export interface WorkingTimes {
  id: string;
  checkInAfter: any;
  checkOutBefore: any;
  workingHour: any;
  totalWorkingHour: any;
  fingerPrint: boolean;
  timePayroll: boolean;
  timePaidLeave: boolean;
  minStart: number;
  startLunch: any;
  endLunch: any;
  items: WorkingTimesItems[];
  mondayTime: any,
  tuesdayTime: any,
  wednesdayTime: any,
  thursdayTime: any,
  fridayTime: any,
  saturdayTime: any,
  sundayTime: any
}

export interface WorkingTimesItemsValues {
  from: number;
  to: number;
}

export interface WorkingTimesItems {
  id: string;
  values: WorkingTimesItemsValues[];
  totalTime: number;
  weekDayId: number;
  configType: number;
}

export const WORKING_TIMES = [
  {value: 0, name: '00:00'},
  {value: 900, name: '00:15'},
  {value: 1800, name: '00:30'},
  {value: 2700, name: '00:45'},
  {value: 3600, name: '01:00'},
  {value: 4500, name: '01:15'},
  {value: 5400, name: '01:30'},
  {value: 6300, name: '01:45'},
  {value: 7200, name: '02:00'},
  {value: 8100, name: '02:15'},
  {value: 9000, name: '02:30'},
  {value: 9900, name: '02:45'},
  {value: 10800, name: '03:00'},
  {value: 11700, name: '03:15'},
  {value: 12600, name: '03:30'},
  {value: 13500, name: '03:45'},
  {value: 14400, name: '04:00'},
  {value: 15300, name: '04:15'},
  {value: 16200, name: '04:30'},
  {value: 17100, name: '04:45'},
  {value: 18000, name: '05:00'},
  {value: 18900, name: '05:15'},
  {value: 19800, name: '05:30'},
  {value: 20700, name: '05:45'},
  {value: 21600, name: '06:00'},
  {value: 22500, name: '06:15'},
  {value: 23400, name: '06:30'},
  {value: 24300, name: '06:45'},
  {value: 25200, name: '07:00'},
  {value: 26100, name: '07:15'},
  {value: 27000, name: '07:30'},
  {value: 27900, name: '07:45'},
  {value: 28800, name: '08:00'},
  {value: 29700, name: '08:15'},
  {value: 30600, name: '08:30'},
  {value: 31500, name: '08:45'},
  {value: 32400, name: '09:00'},
  {value: 33300, name: '09:15'},
  {value: 34200, name: '09:30'},
  {value: 35100, name: '09:45'},
  {value: 36000, name: '10:00'},
  {value: 36900, name: '10:15'},
  {value: 37800, name: '10:30'},
  {value: 38700, name: '10:45'},
  {value: 39600, name: '11:00'},
  {value: 40500, name: '11:15'},
  {value: 41400, name: '11:30'},
  {value: 42300, name: '11:45'},
  {value: 43200, name: '12:00'},
  {value: 44100, name: '12:15'},
  {value: 45000, name: '12:30'},
  {value: 45900, name: '12:45'},
  {value: 46800, name: '13:00'},
  {value: 47700, name: '13:15'},
  {value: 48600, name: '13:30'},
  {value: 49500, name: '13:45'},
  {value: 50400, name: '14:00'},
  {value: 51300, name: '14:15'},
  {value: 52200, name: '14:30'},
  {value: 53100, name: '14:45'},
  {value: 54000, name: '15:00'},
  {value: 54900, name: '15:15'},
  {value: 55800, name: '15:30'},
  {value: 56700, name: '15:45'},
  {value: 57600, name: '16:00'},
  {value: 58500, name: '16:15'},
  {value: 59400, name: '16:30'},
  {value: 60300, name: '16:45'},
  {value: 61200, name: '17:00'},
  {value: 62100, name: '17:15'},
  {value: 63000, name: '17:30'},
  {value: 63900, name: '17:45'},
  {value: 64800, name: '18:00'},
  {value: 65700, name: '18:15'},
  {value: 66600, name: '18:30'},
  {value: 67500, name: '18:45'},
  {value: 68400, name: '19:00'},
  {value: 69300, name: '19:15'},
  {value: 70200, name: '19:30'},
  {value: 71100, name: '19:45'},
  {value: 72000, name: '20:00'},
  {value: 72900, name: '20:15'},
  {value: 73800, name: '20:30'},
  {value: 74700, name: '20:45'},
  {value: 75600, name: '21:00'},
  {value: 76500, name: '21:15'},
  {value: 77400, name: '21:30'},
  {value: 78300, name: '21:45'},
  {value: 79200, name: '22:00'},
  {value: 80100, name: '22:15'},
  {value: 8100, name: '22:30'},
  {value: 81900, name: '22:45'},
  {value: 82800, name: '23:00'},
  {value: 83700, name: '23:15'},
  {value: 84600, name: '23:30'},
  {value: 85500, name: '23:45'},
  {value: 86400, name: '24:00'}
];
export const WORKING_HOLIDAY = [
  {value: 'NONE', name: 'None'},
  {value: 'MONTHLY', name: 'Monthly'},
  {value: 'YEARLY', name: 'Yearly'},
];
