export interface RequestTypeUrlPaths {
  workingAfterHours: string;
  updateTimesheet: string;
  workingOutside: string;
  workFromHome: string;
  leave: string;
  transferLeaveEntitlements?: string;
}

export interface CombineRequestTypeUrlPaths extends RequestTypeUrlPaths {
  myWorkingAfterHours: string;
  myUpdateTimesheet: string;
  myWorkingOutside: string;
  myWorkFromHome: string;
  myLeave: string;
  myTransferLeaveEntitlements: string;
}
