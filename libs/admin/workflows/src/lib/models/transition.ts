import { BaseObject } from '@nexthcm/cdk';
import { ConditionType, PostFunctionType, TransitionOptionIndex, ValidatorType } from '../enums';
import { Status } from './status';

export type TransitionOptionType = ConditionType | ValidatorType | PostFunctionType;
export type TransitionOptions = TransitionCondition | TransitionValidator | TransitionPostFunction;

export interface Transition {
  id: string;
  name: string;
  description?: string;
  fromStateId?: string;
  toStateId: string;
  conditionsOperator: 'OR' | 'AND';
  conditions: TransitionCondition[];
  validators: TransitionValidator[];
  postFunctions: TransitionPostFunction[];
}

export interface TransitionCondition {
  conditionType: TransitionOption<ConditionType>;
  conditionOperator?: 'OR' | 'AND';
  values?: BaseObject[];
}

export interface TransitionValidator {
  validatorType: TransitionOption<ValidatorType>;
  users: BaseObject[];
  permissions: BaseObject[];
}

export interface TransitionPostFunction {
  postFunctionType: TransitionOption<PostFunctionType>;
  values?: BaseObject[];
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

export interface TransitionOptionsDialogData<T extends TransitionOptionType, G extends TransitionOptions> {
  items: G[];
  item: T;
}
