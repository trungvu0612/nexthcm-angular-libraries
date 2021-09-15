import { Status } from './status';

export interface AddStatusData {
  allowAll: boolean;
  status: Status | null;
}
