import { createAction, props } from '@datorama/akita-ng-effects';

import { Status } from '../../models';

export const loadStatuses = createAction('[Workflows] Load Statuses');
export const upsertStatus = createAction('[Workflows] Upsert Status', props<{ data: Status }>());
