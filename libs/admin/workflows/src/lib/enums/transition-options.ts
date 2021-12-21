export enum ConditionType {
  Permission = 'C-001',
  UserInGroup = 'C-002',
  UserInTitles = 'C-003',
  OnlyReporter = 'C-004',
  OnlyAssignee = 'C-005',
  ReportingMethods = 'C-006',
}

export enum ValidatorType {
  Permission = 'V-001',
  UserPermission = 'V-002',
}

export enum PostFunctionType {
  AssignToDirectLeader = 'PF-001',
  AssignToTheNearestLeaderWithASpecifiedTitle = 'PF-002',
  AssignToReporter = 'PF-003',
  SendEmailAndNotificationToTheLeaderWithASpecifiedTitle = 'PF-004',
  SendEmailAndNotificationToTheSomeoneRelated = 'PF-007',
  AddEntitlementAfterCancelLeave = 'PF-008',
  TransferRemainingLeaveEntitlement = 'PF-009',
  SendEmailAndNotificationToTheReporter = 'PF-990',
  SendEmailAndNotificationToTheNewAssignee = 'PF-991',
  CreateComment = 'PF-992',
  UpdateChangeHistoryForAnIssueAndStoreTheIssueInIheDatabase = 'PF-993',
  SetIssueStatusToTheLinkedStatusOfTheDestinationWorkflowStatus = 'PF-994',
}

export enum TransitionOptionIndex {
  Conditions,
  Validators,
  PostFunctions,
}
