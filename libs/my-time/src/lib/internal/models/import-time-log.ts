export interface Base {
  cif: string;
  fullName: string;
  office: string;
}

export interface UserTimeLog extends Base {
  dateTracking: string;
  timeIn: string;
  timeOut: string;
  isWrongFormat?: boolean;
  isConflictData?: boolean;
  isDataNotFound?: boolean;
  isDuplicateRecord?: boolean;
  isEdited?: boolean;
}
