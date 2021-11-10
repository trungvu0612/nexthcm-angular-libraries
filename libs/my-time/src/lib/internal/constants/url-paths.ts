import { CombineRequestTypeUrlPaths, RequestTypeUrlPaths } from '../models';

export const REQUEST_DETAIL_URL_PATHS: Readonly<CombineRequestTypeUrlPaths> = Object.freeze({
  myWorkingAfterHours: 'ot-requests/me',
  workingAfterHours: 'ot-requests',
  myUpdateTimesheet: 'timesheet-updates/me',
  updateTimesheet: 'timesheet-updates',
  myWorkingOnsite: 'outside/me',
  workingOnsite: 'outside',
  myWorkFromHome: 'wfh/me',
  workFromHome: 'wfh',
  myLeave: 'leaves/me',
  leave: 'leaves',
  myTransferLeaveEntitlements: 'leave-entitlement-transfer/me',
  transferLeaveEntitlements: 'leave-entitlement-transfer',
});

export const REQUEST_COMMENT_URL_PATHS: Readonly<RequestTypeUrlPaths> = Object.freeze({
  workingAfterHours: 'hcm_ot_comment',
  updateTimesheet: 'hcm_update_time_comment',
  workingOnsite: 'hcm_working_onsite_comment',
  workFromHome: 'hcm_wfh_comment',
  leave: 'hcm_leave_comment',
});
