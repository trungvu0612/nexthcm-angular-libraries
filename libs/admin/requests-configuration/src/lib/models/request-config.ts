import { BaseWorkflow } from '@nexthcm/cdk';

import { RequestType } from '../enums/request-type';

export interface RequestConfig {
  processId: string;
  type: RequestType;
  workflow?: BaseWorkflow;
}
