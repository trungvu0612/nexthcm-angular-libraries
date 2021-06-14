import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { StatusType } from '../models/status-type';

export interface GlobalStatusTypesState {
  statusTypes: StatusType[];
}

export const GLOBAL_STATUS_TYPES_RX_STATE = new InjectionToken<RxState<GlobalStatusTypesState>>(
  'GLOBAL_STATUS_TYPES_RX_STATE'
);
