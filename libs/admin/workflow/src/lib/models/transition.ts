import { ConditionType, PostFunctionType, TransitionOptionIndex, ValidatorType } from '../enums';
import { Status } from './status';

export interface Transition {
  id: string;
  name: string;
  description?: string;
  fromStateId?: string;
  toStateId: string;
  conditions: TransitionCondition[];
  validators: TransitionValidator[];
  postFunctions: TransitionPostFunction[];
}

export interface TransitionCondition {
  conditionType: TransitionOption<ConditionType>;
  conditionOperator: 'OR' | 'AND';
  values: any[];
}

export interface TransitionValidator {
  validatorType: TransitionOption<ValidatorType>;
  values: any[];
}

export interface TransitionPostFunction {
  postFunctionType: TransitionOption<PostFunctionType>;
  values: any[];
}

export interface TransitionOption<T> {
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
