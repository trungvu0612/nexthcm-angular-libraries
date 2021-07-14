import { Policy } from '@nexthcm/admin-permissions';

export interface AdminUserRole {
  name?: string;
  description?: string;
  policy?: Policy;
}
