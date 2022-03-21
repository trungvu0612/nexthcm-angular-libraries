import { BasePermission } from './base-permission';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  policies: BasePermission[];
  policyRemoves: BasePermission[];
}
