import { CommonStatus } from '@nexthcm/cdk';
import { ModuleCode, SyncType } from '../enums';

export interface SynchronizationSetting {
  id: string;
  name: string;
  description: string;
  value: string;
  status: CommonStatus;
  type: SyncType;
  moduleCode: ModuleCode;
  isManual: string;
  statusBoolean?: boolean;
}
