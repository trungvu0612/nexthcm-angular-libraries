import { UserDto } from '@nexthcm/cdk';

export interface Knowledge {
  id: string;
  thumbnail: string;
  createdDate: number;
  topic: string;
  shortDescription: string;
  longDescription: string;
}

export interface Category {
  id: string;
  userCreatedBy: UserDto;
  status: number;
  name: string;
  description: string;
  policyImage?: string
}
