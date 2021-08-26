export enum ConditionType {
  Permission = 'C-001',
  UserInGroup = 'C-002',
  UserInTitles = 'C-003',
  OnlyReporter = 'C-004',
  OnlyAssignee = 'C-005',
}

export enum ValidatorType {
  Permission = 'V-001',
  UserPermission = 'V-002',
}

export enum PostFunctionType {
  AssignToDirectLeader = 'P-001',
  AssignToTheNearestLeaderWithASpecifiedTitle = 'P-002',
  AssignToReporter = 'P-003',
  CreateComment = 'P-004',
  UpdateChangeHistoryForAnIssueAndStoreTheIssueInIheDatabase = 'P-005',
  SetIssueStatusToTheLinkedStatusOfTheDestinationWorkflowStatus = 'P-006',
  SendEmailAndNotificationToTheReporter = 'P-007',
  SendEmailAndNotificationToTheLeaderWithASpecifiedTitle = 'P-008',
  SendEmailAndNotificationToTheNewAssignee = 'P-009',
}

export enum TransitionOptionIndex {
  Conditions,
  Validators,
  PostFunctions,
}
