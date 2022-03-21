import { CommonStatus, EmployeeInfo } from '@nexthcm/cdk';

export interface KnowledgeBaseCategory {
  id: string;
  userCreatedBy?: EmployeeInfo;
  status: CommonStatus;
  name: string;
  description: string;
  statusBoolean?: boolean;
}
