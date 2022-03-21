export interface RequestTypeUrlPaths {
  workingAfterHours: string;
  updateTimesheet: string;
  workingOnsite: string;
  workFromHome: string;
  leave: string;
  transferLeaveEntitlements?: string;
}

export interface CombineRequestTypeUrlPaths extends RequestTypeUrlPaths {
  myWorkingAfterHours: string;
  myUpdateTimesheet: string;
  myWorkingOnsite: string;
  myWorkFromHome: string;
  myLeave: string;
  myTransferLeaveEntitlements: string;
}
