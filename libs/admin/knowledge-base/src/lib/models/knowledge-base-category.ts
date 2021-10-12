import { CommonStatus, EmployeeGeneralInformation } from '@nexthcm/cdk';

export interface KnowledgeBaseCategory {
  id: string;
  userCreatedBy?: EmployeeGeneralInformation;
  status: CommonStatus;
  name: string;
  description: string;
  statusBoolean?: boolean;
}
