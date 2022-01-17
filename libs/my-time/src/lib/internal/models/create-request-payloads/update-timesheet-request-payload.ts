export interface UpdateTimesheetRequestPayload {
  userId: string;
  timeSheetId: string;
  createdDate: number;
  /**
   * New in-time in seconds
   */
  newInTime: number;
  /**
   * New out-time in seconds
   */
  newOutTime: number;
  comment: string;
  sendTo: string;
  stateId: string;
}
