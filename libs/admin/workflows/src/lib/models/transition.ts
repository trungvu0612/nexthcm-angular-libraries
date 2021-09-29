import { BaseObject, WorkflowTransition } from '@nexthcm/cdk';
import { ConditionType, PostFunctionType, TransitionOptionIndex, ValidatorType } from '../enums';
import { EmailTemplate } from './email-template';
import { Status } from './status';

export type TransitionOptionType = ConditionType | ValidatorType | PostFunctionType;
export type TransitionOptions = TransitionCondition | TransitionValidator | TransitionPostFunction;

export interface Transition extends WorkflowTransition {
  description?: string;
  conditionOperator: 'OR' | 'AND';
  conditions: TransitionCondition[];
  validators: TransitionValidator[];
  postFunctions: TransitionPostFunction[];
  allState?: boolean;
}

export interface TransitionCondition {
  conditionType: TransitionOption<ConditionType>;
  conditionOperator?: 'OR' | 'AND';
  values?: BaseObject[];
}

export interface TransitionValidator {
  validatorType: TransitionOption<ValidatorType>;
  values: { users: BaseObject[]; permissions: string[] };
}

export interface TransitionPostFunction {
  postFunctionType: TransitionOption<PostFunctionType>;
  values: [TransitionPostFunctionValue];
}

export interface TransitionPostFunctionValue {
  jobTitle: BaseObject;
  emailTemplate: EmailTemplate;
}

export interface TransitionOption<T extends TransitionOptionType> {
  id: string;
  name: string;
  description: string;
  code: T;
}

export interface UpsertTransitionData {
  isNew: boolean;
  addedStatuses: Status[];
  transition?: Transition;
}

export interface TransitionDetailData {
  index: TransitionOptionIndex;
  transition: Transition;
}

export interface TransitionOptionsDialogData<T extends TransitionOptions> {
  items: T[];
  item?: T;
}
