import { BaseObject, EmployeeInfo, Organization } from '@nexthcm/cdk';
import { TuiDayRange } from '@taiga-ui/cdk';

export interface LeaveEntitlement {
  id: string;
  entitlement: number;
  leaveType: BaseObject;
  orgId?: string;
  orgDTO?: Organization;
  fromTo?: TuiDayRange;
  fromDate: number;
  toDate: number;
  employeeDTO?: BaseObject;
  employeeId?: string;
  jobTitle?: string[];
  /**
   * Add to multiple employees
   */
  status: boolean | 1 | 0;
}

export interface EmployeeLeaveEntitlement {
  leaveTypeId: string;
  leaveTypeName: string;
  remainingEntitlement: number;
  totalEntitlement: number;
  totalUsedEntitlement: number;
  employee: EmployeeInfo;
}
