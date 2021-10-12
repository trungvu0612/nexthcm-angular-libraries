import { BaseObject } from '@nexthcm/cdk';

export interface BasePermission extends BaseObject {
  code: string;
  description: string;
}
