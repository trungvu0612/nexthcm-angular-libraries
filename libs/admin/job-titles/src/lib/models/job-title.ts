import { CommonStatus } from '@nexthcm/cdk';

export interface JobTitle {
  id: string;
  name: string;
  description: string;
  state: CommonStatus;
  hasLDAPUser: boolean;
  statusBoolean?: boolean;
}
