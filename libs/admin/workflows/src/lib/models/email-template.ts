import { CommonStatus } from '@nexthcm/cdk';

export interface EmailTemplate {
  id: string;
  name: string;
  status: CommonStatus;
  delta: string;
  body: string;
  statusBoolean?: boolean;
}
