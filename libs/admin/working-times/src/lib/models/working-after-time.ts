export interface Values {
  minOtHours: number;
  maxOtHours: number;
  minOtMinutes: number;
  maxOtMinutes: number;
  otBreakHours: number;
  minStart: number;
}

export interface Items {
  values: Values[];
  weekDayId: number;
}

export interface WorkingAfterTime {
  fingerPrint: boolean;
  minOtHours: number;
  maxOtHours: number;
  minOtMinutes: number;
  maxOtMinutes: number;
  otBreakHours: number;
  minStart: number;
  items: Items[];
}
