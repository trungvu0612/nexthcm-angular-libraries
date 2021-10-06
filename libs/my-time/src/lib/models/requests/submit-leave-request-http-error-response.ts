export interface LeaveDuplicated {
  fromDate: number;
  toDate: number;
  leaveTypeName: string;
}

export interface DuplicatedLeaveRequestHttpErrorResponseMetadata {
  leaveDuplicatedList: LeaveDuplicated[];
}

export interface ExceedLeaveEntitlementMetadata {
  leaveTypeName: string;
  durationInDay: number;
  exceedEntitlement: number;
  remainingEntitlement: number;
}

export type SubmitLeaveRequestHttpErrorResponse =
  | {
      message: 'LEAVE_IS_DUPLICATED_DURATION_WITH_ANOTHER_LEAVE';
      errorMetadata: DuplicatedLeaveRequestHttpErrorResponseMetadata;
    }
  | {
      message: 'LEAVE_SUBMIT_LEAVE_DURATION_EXCEED_LEAVE_ENTITLEMENT';
      errorMetadata: ExceedLeaveEntitlementMetadata;
    }
  | {
      message: Exclude<
        string,
        'LEAVE_IS_DUPLICATED_DURATION_WITH_ANOTHER_LEAVE' | 'LEAVE_SUBMIT_LEAVE_DURATION_EXCEED_LEAVE_ENTITLEMENT'
      >;
      errorMetadata: any;
    };
