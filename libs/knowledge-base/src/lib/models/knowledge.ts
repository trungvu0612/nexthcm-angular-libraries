import { UserDto } from '@nexthcm/core';

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
}
