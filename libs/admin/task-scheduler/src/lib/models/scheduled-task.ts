import { CommonStatus } from '@nexthcm/cdk';
import { ModuleCode, ScheduleType } from '../enums';

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  value: string;
  status: CommonStatus;
  type: ScheduleType;
  moduleCode: ModuleCode;
  isManual: string;
  statusBoolean?: boolean;
}
