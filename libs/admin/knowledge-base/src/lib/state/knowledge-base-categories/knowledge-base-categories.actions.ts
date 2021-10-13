import { createAction, props } from '@datorama/akita-ng-effects';
import { KnowledgeBaseCategory } from '../../models';

export const loadKnowledgeBaseCategories = createAction('[Knowledge Base Categories] Load Knowledge Base Categories');
export const upsertKnowledgeBaseCategory = createAction(
  '[Knowledge Base Categories] Upsert Knowledge Base Category',
  props<{ data: KnowledgeBaseCategory }>()
);
export const removeKnowledgeBaseCategory = createAction(
  '[[Knowledge Base Categories] Remove Knowledge Base Category',
  props<{ id: string }>()
);
