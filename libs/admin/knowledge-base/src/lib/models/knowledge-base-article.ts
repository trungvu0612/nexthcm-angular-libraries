import { CommonStatus, EmployeeGeneralInformation } from '@nexthcm/cdk';
import { KnowledgeBaseCategory } from './knowledge-base-category';

export interface KnowledgeBaseArticle {
  id: string;
  orgId: string;
  status: CommonStatus;
  thumbnail: string;
  mobileThumbnail: string;
  slug: string;
  topic: string;
  longDescription: string;
  shortDescription: string;
  policyCategory: KnowledgeBaseCategory;
  statusBoolean?: boolean;
  userCreatedBy?: EmployeeGeneralInformation;
}
