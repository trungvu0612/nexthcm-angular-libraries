import { createAction, props } from '@datorama/akita-ng-effects';
import { EmailTemplate } from '../models';

export const loadEmailTemplates = createAction('[Email Templates] Load Email Templates');
export const upsertEmailTemplate = createAction(
  '[Email Templates] Upsert Email Template',
  props<{ data: EmailTemplate }>()
);
export const removeEmailTemplate = createAction(
  '[Email Templates] Remove Email Template',
  props<{ id: string }>()
);
