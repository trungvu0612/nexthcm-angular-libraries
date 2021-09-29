export interface RequestTypeUrlPath {
  workingAfterHours: string;
  updateTimesheet: string;
  workingOutside: string;
  workFromHome: string;
  leave: string;
}

export interface CombineRequestTypeUrlPath extends RequestTypeUrlPath {
  myWorkingAfterHours: string;
  myUpdateTimesheet: string;
  myWorkingOutside: string;
  myWorkFromHome: string;
  myLeave: string;
}
