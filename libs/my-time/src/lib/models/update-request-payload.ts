import { RequestStatus } from '../enums';

export interface UpdateRequestPayload {
  status: RequestStatus;
  reason?: string;
}
