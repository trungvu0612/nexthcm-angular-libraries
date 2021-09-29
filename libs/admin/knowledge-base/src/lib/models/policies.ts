import { UserDto } from '@nexthcm/cdk';

export interface AdminPolicy {
  id?: string;
  orgId?: string;
  status?: number;
  publishedDate?: number;
  thumbnail?: string;
  createdDate?: number | Date;
  mobileThumbnail?: string;
  slug?: string;
  topic?: string;
  longDescription?: string;
  shortDescription?: string;
}
export interface Category {
  id: string;
  userCreatedBy: UserDto;
  status: number;
  name: string;
  description: string;
}
