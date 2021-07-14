import { Policy } from '../../../../permissions/src/lib/models/policy';

export interface AdminUserRole {
  name?: string;
  description?: string;
  policy?: Policy;
}
