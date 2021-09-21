import { CommonStatus } from '@nexthcm/cdk';

export interface EmailTemplate {
  id: string;
  name: string;
  status: CommonStatus;
  subject: string;
  delta: string;
  body: string;
  isTemplate: boolean;
  statusBoolean?: boolean; // mapping with toggling status
}
