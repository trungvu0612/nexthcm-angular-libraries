import { RequestStatus } from '../../enums';

export interface BaseRequest {
  id: string;
  comment: string;
  status: RequestStatus;
}

