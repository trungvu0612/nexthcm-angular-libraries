
export interface LeavePeriod {
  orgId?: string;
  name?: string;
  startDate?: number;
  endDate?: number;
  startDateEdit?: Date | undefined;
  endDateEdit?: Date | undefined;
}

export interface ResLeavePeriod {
  code?: string;
  data?: LeavePeriod;
}
