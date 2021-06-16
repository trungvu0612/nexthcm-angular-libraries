export interface WorkingHour {
  id?: string;
  day?: string;
  date?: string;
  office?: string;
  timeIn?: string;
  timeOut?: string;
  totalWorkingTime?: string;
  workingDay?: string;
  ot?: string;
  onsiteDay?: string;
  leave?: string;
  cif?: string;
  employee?: string;
  fullName?: string;
}

export interface SearchWorkingHour {
  name: string;
}
