import { CommonStatus } from '../enums';

export interface JobTitle {
  id: string;
  name: string;
  description: string;
  state: CommonStatus;
  hasLDAPUser: boolean;
  isSkipCheckInOutNormal: boolean;
}
