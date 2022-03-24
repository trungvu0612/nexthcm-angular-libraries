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

export interface WorkingTimes {
  id: string;
  orgId: string;
  checkInAfter: number;
  checkOutBefore: number;
  startLunch: number;
  workingHour: number;
  endLunch: number;
  totalWorkingHour: number;
  startTimeInWorkingDay: number;
  endTimeInWorkingDay: number;
  maximumPeriodTimeCheckOutInApp: number;
  maxPaidLeaveToCash: number;
  fingerPrint: boolean;
  timePayroll: boolean;
  timePaidLeave: boolean;
  items: WorkingTimesItems[];
}
