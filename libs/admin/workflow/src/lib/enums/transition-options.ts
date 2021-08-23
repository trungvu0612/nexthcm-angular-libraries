export enum ConditionType {
  Permission = 'C-001',
  UserInGroup = 'C-002',
  UserInAnyGroup = 'C-003',
  OnlyReporter = 'C-004',
  OnlyAssignee = 'C-005',
}

export enum ValidatorType {
  Permission = 'V-001',
  UserPermission = 'V-002',
}

export enum PostFunctionType {
  AssignToDirectLeader = 'P-001',
  SendEmailAndNotificationToTheLeaderWithASpecifiedTitle = 'P-002',
  SendEmailAndNotificationToTheNewAssignee = 'P-003',
  SendEmailAndNotificationToTheReporter = 'P-004',
  SetIssueStatusToTheLinkedStatusOfTheDestinationWorkflowStatus = 'P-005',
  UpdateChangeHistoryForAnIssueAndStoreTheIssueInIheDatabase = 'P-006',
  AddACommentToAnIssueIfOneIsEnteredDuringATransition = 'P-007',
  AssignToReporter = 'P-008',
  AssignToTheNearestLeaderWithASpecifiedTitle = 'P-009',
}

export enum TransitionOptionIndex {
  Conditions,
  Validators,
  PostFunctions,
}
