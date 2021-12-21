import { createAction } from '@datorama/akita-ng-effects';

export const loadOffices = createAction('[Offices] Load offices');
export const refreshOffices = createAction('[Offices] Refresh offices');
export const loadOnsiteOffices = createAction('[Offices] Load onsite-offices');
export const refreshOnsiteOffices = createAction('[Offices] Refresh onsite-offices');
export const loadWFHOffices = createAction('[Offices] Load WFH offices');
export const refreshWFHOffices = createAction('[Offices] Refresh WFH offices');
