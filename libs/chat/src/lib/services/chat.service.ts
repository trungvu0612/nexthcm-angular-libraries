import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  smallint: number;
  timestamp: string;
  uuid: string;
}

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export interface BooleanComparisonExp {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
}

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export interface IntComparisonExp {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
}

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export interface StringComparisonExp {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
}

/** columns and relationships of "chatapp.chat_attachment" */
export interface ChatappChatAttachment {
  chat_attachment_id: Scalars['uuid'];
  file_url?: Maybe<Scalars['String']>;
  message_id: Scalars['uuid'];
  thumb_url?: Maybe<Scalars['String']>;
}

/** aggregated selection of "chatapp.chat_attachment" */
export interface ChatappChatAttachmentAggregate {
  aggregate?: Maybe<ChatappChatAttachmentAggregateFields>;
  nodes: Array<ChatappChatAttachment>;
}

/** aggregate fields of "chatapp.chat_attachment" */
export interface ChatappChatAttachmentAggregateFields {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatAttachmentMaxFields>;
  min?: Maybe<ChatappChatAttachmentMinFields>;
}

/** aggregate fields of "chatapp.chat_attachment" */
export interface ChatappChatAttachmentAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatAttachmentSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentAggregateOrderBy {
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatAttachmentMaxOrderBy>;
  min?: Maybe<ChatappChatAttachmentMinOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentArrRelInsertInput {
  data: Array<ChatappChatAttachmentInsertInput>;
  on_conflict?: Maybe<ChatappChatAttachmentOnConflict>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_attachment". All fields are combined with a logical 'AND'. */
export interface ChatappChatAttachmentBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatAttachmentBoolExp>>>;
  _not?: Maybe<ChatappChatAttachmentBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatAttachmentBoolExp>>>;
  chat_attachment_id?: Maybe<UuidComparisonExp>;
  file_url?: Maybe<StringComparisonExp>;
  message_id?: Maybe<UuidComparisonExp>;
  thumb_url?: Maybe<StringComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_attachment" */
export enum ChatappChatAttachmentConstraint {
  /** unique or primary key constraint */
  ChatAttachmentPkey = 'chat_attachment_pkey',
}

/** input type for inserting data into table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentInsertInput {
  chat_attachment_id?: Maybe<Scalars['uuid']>;
  file_url?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  thumb_url?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface ChatappChatAttachmentMaxFields {
  chat_attachment_id?: Maybe<Scalars['uuid']>;
  file_url?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  thumb_url?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentMaxOrderBy {
  chat_attachment_id?: Maybe<OrderBy>;
  file_url?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  thumb_url?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatAttachmentMinFields {
  chat_attachment_id?: Maybe<Scalars['uuid']>;
  file_url?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  thumb_url?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentMinOrderBy {
  chat_attachment_id?: Maybe<OrderBy>;
  file_url?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  thumb_url?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatAttachment>;
}

/** input type for inserting object relation for remote table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentObjRelInsertInput {
  data: ChatappChatAttachmentInsertInput;
  on_conflict?: Maybe<ChatappChatAttachmentOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentOnConflict {
  constraint: ChatappChatAttachmentConstraint;
  update_columns: Array<ChatappChatAttachmentUpdateColumn>;
  where?: Maybe<ChatappChatAttachmentBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_attachment" */
export interface ChatappChatAttachmentOrderBy {
  chat_attachment_id?: Maybe<OrderBy>;
  file_url?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  thumb_url?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_attachment" */
export interface ChatappChatAttachmentPkColumnsInput {
  chat_attachment_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_attachment" */
export enum ChatappChatAttachmentSelectColumn {
  /** column name */
  ChatAttachmentId = 'chat_attachment_id',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  MessageId = 'message_id',
  /** column name */
  ThumbUrl = 'thumb_url',
}

/** input type for updating data in table "chatapp.chat_attachment" */
export interface ChatappChatAttachmentSetInput {
  chat_attachment_id?: Maybe<Scalars['uuid']>;
  file_url?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  thumb_url?: Maybe<Scalars['String']>;
}

/** update columns of table "chatapp.chat_attachment" */
export enum ChatappChatAttachmentUpdateColumn {
  /** column name */
  ChatAttachmentId = 'chat_attachment_id',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  MessageId = 'message_id',
  /** column name */
  ThumbUrl = 'thumb_url',
}

/** columns and relationships of "chatapp.chat_message" */
export interface ChatappChatMessage {
  chat_message_id: Scalars['uuid'];
  /** An array relationship */
  chat_message_visibilities: Array<ChatappChatMessageVisibility>;
  /** An aggregated array relationship */
  chat_message_visibilities_aggregate: ChatappChatMessageVisibilityAggregate;
  /** An object relationship */
  chat_room: ChatappChatRoom;
  /** An object relationship */
  chat_user: ChatappChatUser;
  content?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['timestamp']>;
  data_type?: Maybe<Scalars['String']>;
  room_id: Scalars['uuid'];
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user_id: Scalars['uuid'];
}

/** columns and relationships of "chatapp.chat_message" */
export interface ChatappChatMessageChatMessageVisibilitiesArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** columns and relationships of "chatapp.chat_message" */
export interface ChatappChatMessageChatMessageVisibilitiesAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** aggregated selection of "chatapp.chat_message" */
export interface ChatappChatMessageAggregate {
  aggregate?: Maybe<ChatappChatMessageAggregateFields>;
  nodes: Array<ChatappChatMessage>;
}

/** aggregate fields of "chatapp.chat_message" */
export interface ChatappChatMessageAggregateFields {
  avg?: Maybe<ChatappChatMessageAvgFields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatMessageMaxFields>;
  min?: Maybe<ChatappChatMessageMinFields>;
  stddev?: Maybe<ChatappChatMessageStddevFields>;
  stddev_pop?: Maybe<ChatappChatMessageStddevPopFields>;
  stddev_samp?: Maybe<ChatappChatMessageStddevSampFields>;
  sum?: Maybe<ChatappChatMessageSumFields>;
  var_pop?: Maybe<ChatappChatMessageVarPopFields>;
  var_samp?: Maybe<ChatappChatMessageVarSampFields>;
  variance?: Maybe<ChatappChatMessageVarianceFields>;
}

/** aggregate fields of "chatapp.chat_message" */
export interface ChatappChatMessageAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_message" */
export interface ChatappChatMessageAggregateOrderBy {
  avg?: Maybe<ChatappChatMessageAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatMessageMaxOrderBy>;
  min?: Maybe<ChatappChatMessageMinOrderBy>;
  stddev?: Maybe<ChatappChatMessageStddevOrderBy>;
  stddev_pop?: Maybe<ChatappChatMessageStddevPopOrderBy>;
  stddev_samp?: Maybe<ChatappChatMessageStddevSampOrderBy>;
  sum?: Maybe<ChatappChatMessageSumOrderBy>;
  var_pop?: Maybe<ChatappChatMessageVarPopOrderBy>;
  var_samp?: Maybe<ChatappChatMessageVarSampOrderBy>;
  variance?: Maybe<ChatappChatMessageVarianceOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_message" */
export interface ChatappChatMessageArrRelInsertInput {
  data: Array<ChatappChatMessageInsertInput>;
  on_conflict?: Maybe<ChatappChatMessageOnConflict>;
}

/** aggregate avg on columns */
export interface ChatappChatMessageAvgFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by avg() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageAvgOrderBy {
  status?: Maybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_message". All fields are combined with a logical 'AND'. */
export interface ChatappChatMessageBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatMessageBoolExp>>>;
  _not?: Maybe<ChatappChatMessageBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatMessageBoolExp>>>;
  chat_message_id?: Maybe<UuidComparisonExp>;
  chat_message_visibilities?: Maybe<ChatappChatMessageVisibilityBoolExp>;
  chat_room?: Maybe<ChatappChatRoomBoolExp>;
  chat_user?: Maybe<ChatappChatUserBoolExp>;
  content?: Maybe<StringComparisonExp>;
  created_date?: Maybe<TimestampComparisonExp>;
  data_type?: Maybe<StringComparisonExp>;
  room_id?: Maybe<UuidComparisonExp>;
  status?: Maybe<IntComparisonExp>;
  type?: Maybe<StringComparisonExp>;
  user_id?: Maybe<UuidComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_message" */
export enum ChatappChatMessageConstraint {
  /** unique or primary key constraint */
  ChatMessagePkey = 'chat_message_pkey',
}

/** input type for incrementing integer column in table "chatapp.chat_message" */
export interface ChatappChatMessageIncInput {
  status?: Maybe<Scalars['Int']>;
}

/** input type for inserting data into table "chatapp.chat_message" */
export interface ChatappChatMessageInsertInput {
  chat_message_id?: Maybe<Scalars['uuid']>;
  chat_message_visibilities?: Maybe<ChatappChatMessageVisibilityArrRelInsertInput>;
  chat_room?: Maybe<ChatappChatRoomObjRelInsertInput>;
  chat_user?: Maybe<ChatappChatUserObjRelInsertInput>;
  content?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['timestamp']>;
  data_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface ChatappChatMessageMaxFields {
  chat_message_id?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['timestamp']>;
  data_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageMaxOrderBy {
  chat_message_id?: Maybe<OrderBy>;
  content?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  data_type?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatMessageMinFields {
  chat_message_id?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['timestamp']>;
  data_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageMinOrderBy {
  chat_message_id?: Maybe<OrderBy>;
  content?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  data_type?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_message" */
export interface ChatappChatMessageMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatMessage>;
}

/** input type for inserting object relation for remote table "chatapp.chat_message" */
export interface ChatappChatMessageObjRelInsertInput {
  data: ChatappChatMessageInsertInput;
  on_conflict?: Maybe<ChatappChatMessageOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_message" */
export interface ChatappChatMessageOnConflict {
  constraint: ChatappChatMessageConstraint;
  update_columns: Array<ChatappChatMessageUpdateColumn>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_message" */
export interface ChatappChatMessageOrderBy {
  chat_message_id?: Maybe<OrderBy>;
  chat_message_visibilities_aggregate?: Maybe<ChatappChatMessageVisibilityAggregateOrderBy>;
  chat_room?: Maybe<ChatappChatRoomOrderBy>;
  chat_user?: Maybe<ChatappChatUserOrderBy>;
  content?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  data_type?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_message" */
export interface ChatappChatMessagePkColumnsInput {
  chat_message_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_message" */
export enum ChatappChatMessageSelectColumn {
  /** column name */
  ChatMessageId = 'chat_message_id',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  DataType = 'data_type',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "chatapp.chat_message" */
export interface ChatappChatMessageSetInput {
  chat_message_id?: Maybe<Scalars['uuid']>;
  content?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['timestamp']>;
  data_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate stddev on columns */
export interface ChatappChatMessageStddevFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageStddevOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_pop on columns */
export interface ChatappChatMessageStddevPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_pop() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageStddevPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_samp on columns */
export interface ChatappChatMessageStddevSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_samp() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageStddevSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate sum on columns */
export interface ChatappChatMessageSumFields {
  status?: Maybe<Scalars['Int']>;
}

/** order by sum() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageSumOrderBy {
  status?: Maybe<OrderBy>;
}

/** update columns of table "chatapp.chat_message" */
export enum ChatappChatMessageUpdateColumn {
  /** column name */
  ChatMessageId = 'chat_message_id',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  DataType = 'data_type',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id',
}

/** aggregate var_pop on columns */
export interface ChatappChatMessageVarPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_pop() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageVarPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate var_samp on columns */
export interface ChatappChatMessageVarSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_samp() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageVarSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate variance on columns */
export interface ChatappChatMessageVarianceFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by variance() on columns of table "chatapp.chat_message" */
export interface ChatappChatMessageVarianceOrderBy {
  status?: Maybe<OrderBy>;
}

/** columns and relationships of "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibility {
  /** An object relationship */
  chat_message: ChatappChatMessage;
  chat_message_visibility_id: Scalars['uuid'];
  /** An object relationship */
  chat_user: ChatappChatUser;
  created_date?: Maybe<Scalars['timestamp']>;
  message_id: Scalars['uuid'];
  status?: Maybe<Scalars['smallint']>;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityAggregate {
  aggregate?: Maybe<ChatappChatMessageVisibilityAggregateFields>;
  nodes: Array<ChatappChatMessageVisibility>;
}

/** aggregate fields of "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityAggregateFields {
  avg?: Maybe<ChatappChatMessageVisibilityAvgFields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatMessageVisibilityMaxFields>;
  min?: Maybe<ChatappChatMessageVisibilityMinFields>;
  stddev?: Maybe<ChatappChatMessageVisibilityStddevFields>;
  stddev_pop?: Maybe<ChatappChatMessageVisibilityStddevPopFields>;
  stddev_samp?: Maybe<ChatappChatMessageVisibilityStddevSampFields>;
  sum?: Maybe<ChatappChatMessageVisibilitySumFields>;
  var_pop?: Maybe<ChatappChatMessageVisibilityVarPopFields>;
  var_samp?: Maybe<ChatappChatMessageVisibilityVarSampFields>;
  variance?: Maybe<ChatappChatMessageVisibilityVarianceFields>;
}

/** aggregate fields of "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityAggregateOrderBy {
  avg?: Maybe<ChatappChatMessageVisibilityAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatMessageVisibilityMaxOrderBy>;
  min?: Maybe<ChatappChatMessageVisibilityMinOrderBy>;
  stddev?: Maybe<ChatappChatMessageVisibilityStddevOrderBy>;
  stddev_pop?: Maybe<ChatappChatMessageVisibilityStddevPopOrderBy>;
  stddev_samp?: Maybe<ChatappChatMessageVisibilityStddevSampOrderBy>;
  sum?: Maybe<ChatappChatMessageVisibilitySumOrderBy>;
  var_pop?: Maybe<ChatappChatMessageVisibilityVarPopOrderBy>;
  var_samp?: Maybe<ChatappChatMessageVisibilityVarSampOrderBy>;
  variance?: Maybe<ChatappChatMessageVisibilityVarianceOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityArrRelInsertInput {
  data: Array<ChatappChatMessageVisibilityInsertInput>;
  on_conflict?: Maybe<ChatappChatMessageVisibilityOnConflict>;
}

/** aggregate avg on columns */
export interface ChatappChatMessageVisibilityAvgFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by avg() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityAvgOrderBy {
  status?: Maybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_message_visibility". All fields are combined with a logical 'AND'. */
export interface ChatappChatMessageVisibilityBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatMessageVisibilityBoolExp>>>;
  _not?: Maybe<ChatappChatMessageVisibilityBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatMessageVisibilityBoolExp>>>;
  chat_message?: Maybe<ChatappChatMessageBoolExp>;
  chat_message_visibility_id?: Maybe<UuidComparisonExp>;
  chat_user?: Maybe<ChatappChatUserBoolExp>;
  created_date?: Maybe<TimestampComparisonExp>;
  message_id?: Maybe<UuidComparisonExp>;
  status?: Maybe<SmallintComparisonExp>;
  user_id?: Maybe<UuidComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_message_visibility" */
export enum ChatappChatMessageVisibilityConstraint {
  /** unique or primary key constraint */
  ChatMessageVisibilityPkey = 'chat_message_visibility_pkey',
}

/** input type for incrementing integer column in table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityIncInput {
  status?: Maybe<Scalars['smallint']>;
}

/** input type for inserting data into table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityInsertInput {
  chat_message?: Maybe<ChatappChatMessageObjRelInsertInput>;
  chat_message_visibility_id?: Maybe<Scalars['uuid']>;
  chat_user?: Maybe<ChatappChatUserObjRelInsertInput>;
  created_date?: Maybe<Scalars['timestamp']>;
  message_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['smallint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface ChatappChatMessageVisibilityMaxFields {
  chat_message_visibility_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  message_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['smallint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityMaxOrderBy {
  chat_message_visibility_id?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatMessageVisibilityMinFields {
  chat_message_visibility_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  message_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['smallint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityMinOrderBy {
  chat_message_visibility_id?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatMessageVisibility>;
}

/** input type for inserting object relation for remote table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityObjRelInsertInput {
  data: ChatappChatMessageVisibilityInsertInput;
  on_conflict?: Maybe<ChatappChatMessageVisibilityOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityOnConflict {
  constraint: ChatappChatMessageVisibilityConstraint;
  update_columns: Array<ChatappChatMessageVisibilityUpdateColumn>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityOrderBy {
  chat_message?: Maybe<ChatappChatMessageOrderBy>;
  chat_message_visibility_id?: Maybe<OrderBy>;
  chat_user?: Maybe<ChatappChatUserOrderBy>;
  created_date?: Maybe<OrderBy>;
  message_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityPkColumnsInput {
  chat_message_visibility_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_message_visibility" */
export enum ChatappChatMessageVisibilitySelectColumn {
  /** column name */
  ChatMessageVisibilityId = 'chat_message_visibility_id',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  MessageId = 'message_id',
  /** column name */
  Status = 'status',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilitySetInput {
  chat_message_visibility_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  message_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['smallint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate stddev on columns */
export interface ChatappChatMessageVisibilityStddevFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityStddevOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_pop on columns */
export interface ChatappChatMessageVisibilityStddevPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_pop() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityStddevPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_samp on columns */
export interface ChatappChatMessageVisibilityStddevSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_samp() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityStddevSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate sum on columns */
export interface ChatappChatMessageVisibilitySumFields {
  status?: Maybe<Scalars['smallint']>;
}

/** order by sum() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilitySumOrderBy {
  status?: Maybe<OrderBy>;
}

/** update columns of table "chatapp.chat_message_visibility" */
export enum ChatappChatMessageVisibilityUpdateColumn {
  /** column name */
  ChatMessageVisibilityId = 'chat_message_visibility_id',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  MessageId = 'message_id',
  /** column name */
  Status = 'status',
  /** column name */
  UserId = 'user_id',
}

/** aggregate var_pop on columns */
export interface ChatappChatMessageVisibilityVarPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_pop() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityVarPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate var_samp on columns */
export interface ChatappChatMessageVisibilityVarSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_samp() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityVarSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate variance on columns */
export interface ChatappChatMessageVisibilityVarianceFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by variance() on columns of table "chatapp.chat_message_visibility" */
export interface ChatappChatMessageVisibilityVarianceOrderBy {
  status?: Maybe<OrderBy>;
}

/** columns and relationships of "chatapp.chat_participant" */
export interface ChatappChatParticipant {
  chat_participant_id: Scalars['uuid'];
  /** An object relationship */
  chat_room?: Maybe<ChatappChatRoom>;
  /** An object relationship */
  chat_user?: Maybe<ChatappChatUser>;
  is_anonymous?: Maybe<Scalars['Boolean']>;
  last_read?: Maybe<Scalars['timestamp']>;
  last_type?: Maybe<Scalars['timestamp']>;
  notify?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Boolean']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "chatapp.chat_participant" */
export interface ChatappChatParticipantAggregate {
  aggregate?: Maybe<ChatappChatParticipantAggregateFields>;
  nodes: Array<ChatappChatParticipant>;
}

/** aggregate fields of "chatapp.chat_participant" */
export interface ChatappChatParticipantAggregateFields {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatParticipantMaxFields>;
  min?: Maybe<ChatappChatParticipantMinFields>;
}

/** aggregate fields of "chatapp.chat_participant" */
export interface ChatappChatParticipantAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_participant" */
export interface ChatappChatParticipantAggregateOrderBy {
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatParticipantMaxOrderBy>;
  min?: Maybe<ChatappChatParticipantMinOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_participant" */
export interface ChatappChatParticipantArrRelInsertInput {
  data: Array<ChatappChatParticipantInsertInput>;
  on_conflict?: Maybe<ChatappChatParticipantOnConflict>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_participant". All fields are combined with a logical 'AND'. */
export interface ChatappChatParticipantBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatParticipantBoolExp>>>;
  _not?: Maybe<ChatappChatParticipantBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatParticipantBoolExp>>>;
  chat_participant_id?: Maybe<UuidComparisonExp>;
  chat_room?: Maybe<ChatappChatRoomBoolExp>;
  chat_user?: Maybe<ChatappChatUserBoolExp>;
  is_anonymous?: Maybe<BooleanComparisonExp>;
  last_read?: Maybe<TimestampComparisonExp>;
  last_type?: Maybe<TimestampComparisonExp>;
  notify?: Maybe<BooleanComparisonExp>;
  role?: Maybe<StringComparisonExp>;
  room_id?: Maybe<UuidComparisonExp>;
  status?: Maybe<BooleanComparisonExp>;
  user_id?: Maybe<UuidComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_participant" */
export enum ChatappChatParticipantConstraint {
  /** unique or primary key constraint */
  ChatParticipantPkey = 'chat_participant_pkey',
}

/** input type for inserting data into table "chatapp.chat_participant" */
export interface ChatappChatParticipantInsertInput {
  chat_participant_id?: Maybe<Scalars['uuid']>;
  chat_room?: Maybe<ChatappChatRoomObjRelInsertInput>;
  chat_user?: Maybe<ChatappChatUserObjRelInsertInput>;
  is_anonymous?: Maybe<Scalars['Boolean']>;
  last_read?: Maybe<Scalars['timestamp']>;
  last_type?: Maybe<Scalars['timestamp']>;
  notify?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Boolean']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface ChatappChatParticipantMaxFields {
  chat_participant_id?: Maybe<Scalars['uuid']>;
  last_read?: Maybe<Scalars['timestamp']>;
  last_type?: Maybe<Scalars['timestamp']>;
  role?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "chatapp.chat_participant" */
export interface ChatappChatParticipantMaxOrderBy {
  chat_participant_id?: Maybe<OrderBy>;
  last_read?: Maybe<OrderBy>;
  last_type?: Maybe<OrderBy>;
  role?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatParticipantMinFields {
  chat_participant_id?: Maybe<Scalars['uuid']>;
  last_read?: Maybe<Scalars['timestamp']>;
  last_type?: Maybe<Scalars['timestamp']>;
  role?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "chatapp.chat_participant" */
export interface ChatappChatParticipantMinOrderBy {
  chat_participant_id?: Maybe<OrderBy>;
  last_read?: Maybe<OrderBy>;
  last_type?: Maybe<OrderBy>;
  role?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_participant" */
export interface ChatappChatParticipantMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatParticipant>;
}

/** input type for inserting object relation for remote table "chatapp.chat_participant" */
export interface ChatappChatParticipantObjRelInsertInput {
  data: ChatappChatParticipantInsertInput;
  on_conflict?: Maybe<ChatappChatParticipantOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_participant" */
export interface ChatappChatParticipantOnConflict {
  constraint: ChatappChatParticipantConstraint;
  update_columns: Array<ChatappChatParticipantUpdateColumn>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_participant" */
export interface ChatappChatParticipantOrderBy {
  chat_participant_id?: Maybe<OrderBy>;
  chat_room?: Maybe<ChatappChatRoomOrderBy>;
  chat_user?: Maybe<ChatappChatUserOrderBy>;
  is_anonymous?: Maybe<OrderBy>;
  last_read?: Maybe<OrderBy>;
  last_type?: Maybe<OrderBy>;
  notify?: Maybe<OrderBy>;
  role?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  user_id?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_participant" */
export interface ChatappChatParticipantPkColumnsInput {
  chat_participant_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_participant" */
export enum ChatappChatParticipantSelectColumn {
  /** column name */
  ChatParticipantId = 'chat_participant_id',
  /** column name */
  IsAnonymous = 'is_anonymous',
  /** column name */
  LastRead = 'last_read',
  /** column name */
  LastType = 'last_type',
  /** column name */
  Notify = 'notify',
  /** column name */
  Role = 'role',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "chatapp.chat_participant" */
export interface ChatappChatParticipantSetInput {
  chat_participant_id?: Maybe<Scalars['uuid']>;
  is_anonymous?: Maybe<Scalars['Boolean']>;
  last_read?: Maybe<Scalars['timestamp']>;
  last_type?: Maybe<Scalars['timestamp']>;
  notify?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Boolean']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "chatapp.chat_participant" */
export enum ChatappChatParticipantUpdateColumn {
  /** column name */
  ChatParticipantId = 'chat_participant_id',
  /** column name */
  IsAnonymous = 'is_anonymous',
  /** column name */
  LastRead = 'last_read',
  /** column name */
  LastType = 'last_type',
  /** column name */
  Notify = 'notify',
  /** column name */
  Role = 'role',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  UserId = 'user_id',
}

/** columns and relationships of "chatapp.chat_rel" */
export interface ChatappChatRel {
  chat_rel_id: Scalars['uuid'];
  /** An object relationship */
  chat_user: ChatappChatUser;
  created_date?: Maybe<Scalars['timestamp']>;
  host_user_id: Scalars['uuid'];
  relate_user_id: Scalars['uuid'];
  status?: Maybe<Scalars['Int']>;
}

/** aggregated selection of "chatapp.chat_rel" */
export interface ChatappChatRelAggregate {
  aggregate?: Maybe<ChatappChatRelAggregateFields>;
  nodes: Array<ChatappChatRel>;
}

/** aggregate fields of "chatapp.chat_rel" */
export interface ChatappChatRelAggregateFields {
  avg?: Maybe<ChatappChatRelAvgFields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatRelMaxFields>;
  min?: Maybe<ChatappChatRelMinFields>;
  stddev?: Maybe<ChatappChatRelStddevFields>;
  stddev_pop?: Maybe<ChatappChatRelStddevPopFields>;
  stddev_samp?: Maybe<ChatappChatRelStddevSampFields>;
  sum?: Maybe<ChatappChatRelSumFields>;
  var_pop?: Maybe<ChatappChatRelVarPopFields>;
  var_samp?: Maybe<ChatappChatRelVarSampFields>;
  variance?: Maybe<ChatappChatRelVarianceFields>;
}

/** aggregate fields of "chatapp.chat_rel" */
export interface ChatappChatRelAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatRelSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_rel" */
export interface ChatappChatRelAggregateOrderBy {
  avg?: Maybe<ChatappChatRelAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatRelMaxOrderBy>;
  min?: Maybe<ChatappChatRelMinOrderBy>;
  stddev?: Maybe<ChatappChatRelStddevOrderBy>;
  stddev_pop?: Maybe<ChatappChatRelStddevPopOrderBy>;
  stddev_samp?: Maybe<ChatappChatRelStddevSampOrderBy>;
  sum?: Maybe<ChatappChatRelSumOrderBy>;
  var_pop?: Maybe<ChatappChatRelVarPopOrderBy>;
  var_samp?: Maybe<ChatappChatRelVarSampOrderBy>;
  variance?: Maybe<ChatappChatRelVarianceOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_rel" */
export interface ChatappChatRelArrRelInsertInput {
  data: Array<ChatappChatRelInsertInput>;
  on_conflict?: Maybe<ChatappChatRelOnConflict>;
}

/** aggregate avg on columns */
export interface ChatappChatRelAvgFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by avg() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelAvgOrderBy {
  status?: Maybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_rel". All fields are combined with a logical 'AND'. */
export interface ChatappChatRelBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatRelBoolExp>>>;
  _not?: Maybe<ChatappChatRelBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatRelBoolExp>>>;
  chat_rel_id?: Maybe<UuidComparisonExp>;
  chat_user?: Maybe<ChatappChatUserBoolExp>;
  created_date?: Maybe<TimestampComparisonExp>;
  host_user_id?: Maybe<UuidComparisonExp>;
  relate_user_id?: Maybe<UuidComparisonExp>;
  status?: Maybe<IntComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_rel" */
export enum ChatappChatRelConstraint {
  /** unique or primary key constraint */
  ChatRelPkey = 'chat_rel_pkey',
}

/** input type for incrementing integer column in table "chatapp.chat_rel" */
export interface ChatappChatRelIncInput {
  status?: Maybe<Scalars['Int']>;
}

/** input type for inserting data into table "chatapp.chat_rel" */
export interface ChatappChatRelInsertInput {
  chat_rel_id?: Maybe<Scalars['uuid']>;
  chat_user?: Maybe<ChatappChatUserObjRelInsertInput>;
  created_date?: Maybe<Scalars['timestamp']>;
  host_user_id?: Maybe<Scalars['uuid']>;
  relate_user_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
}

/** aggregate max on columns */
export interface ChatappChatRelMaxFields {
  chat_rel_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  host_user_id?: Maybe<Scalars['uuid']>;
  relate_user_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
}

/** order by max() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelMaxOrderBy {
  chat_rel_id?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  host_user_id?: Maybe<OrderBy>;
  relate_user_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatRelMinFields {
  chat_rel_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  host_user_id?: Maybe<Scalars['uuid']>;
  relate_user_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
}

/** order by min() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelMinOrderBy {
  chat_rel_id?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  host_user_id?: Maybe<OrderBy>;
  relate_user_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_rel" */
export interface ChatappChatRelMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatRel>;
}

/** input type for inserting object relation for remote table "chatapp.chat_rel" */
export interface ChatappChatRelObjRelInsertInput {
  data: ChatappChatRelInsertInput;
  on_conflict?: Maybe<ChatappChatRelOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_rel" */
export interface ChatappChatRelOnConflict {
  constraint: ChatappChatRelConstraint;
  update_columns: Array<ChatappChatRelUpdateColumn>;
  where?: Maybe<ChatappChatRelBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_rel" */
export interface ChatappChatRelOrderBy {
  chat_rel_id?: Maybe<OrderBy>;
  chat_user?: Maybe<ChatappChatUserOrderBy>;
  created_date?: Maybe<OrderBy>;
  host_user_id?: Maybe<OrderBy>;
  relate_user_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_rel" */
export interface ChatappChatRelPkColumnsInput {
  chat_rel_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_rel" */
export enum ChatappChatRelSelectColumn {
  /** column name */
  ChatRelId = 'chat_rel_id',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  HostUserId = 'host_user_id',
  /** column name */
  RelateUserId = 'relate_user_id',
  /** column name */
  Status = 'status',
}

/** input type for updating data in table "chatapp.chat_rel" */
export interface ChatappChatRelSetInput {
  chat_rel_id?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  host_user_id?: Maybe<Scalars['uuid']>;
  relate_user_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
}

/** aggregate stddev on columns */
export interface ChatappChatRelStddevFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelStddevOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_pop on columns */
export interface ChatappChatRelStddevPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_pop() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelStddevPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_samp on columns */
export interface ChatappChatRelStddevSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_samp() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelStddevSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate sum on columns */
export interface ChatappChatRelSumFields {
  status?: Maybe<Scalars['Int']>;
}

/** order by sum() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelSumOrderBy {
  status?: Maybe<OrderBy>;
}

/** update columns of table "chatapp.chat_rel" */
export enum ChatappChatRelUpdateColumn {
  /** column name */
  ChatRelId = 'chat_rel_id',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  HostUserId = 'host_user_id',
  /** column name */
  RelateUserId = 'relate_user_id',
  /** column name */
  Status = 'status',
}

/** aggregate var_pop on columns */
export interface ChatappChatRelVarPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_pop() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelVarPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate var_samp on columns */
export interface ChatappChatRelVarSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_samp() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelVarSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate variance on columns */
export interface ChatappChatRelVarianceFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by variance() on columns of table "chatapp.chat_rel" */
export interface ChatappChatRelVarianceOrderBy {
  status?: Maybe<OrderBy>;
}

/** columns and relationships of "chatapp.chat_room" */
export interface ChatappChatRoom {
  avatar?: Maybe<Scalars['String']>;
  /** An array relationship */
  chat_messages: Array<ChatappChatMessage>;
  /** An aggregated array relationship */
  chat_messages_aggregate: ChatappChatMessageAggregate;
  /** An array relationship */
  chat_participants: Array<ChatappChatParticipant>;
  /** An aggregated array relationship */
  chat_participants_aggregate: ChatappChatParticipantAggregate;
  created_by?: Maybe<Scalars['uuid']>;
  created_date: Scalars['timestamp'];
  last_message?: Maybe<Scalars['timestamp']>;
  room_id: Scalars['uuid'];
  status?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
}

/** columns and relationships of "chatapp.chat_room" */
export interface ChatappChatRoomChatMessagesArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** columns and relationships of "chatapp.chat_room" */
export interface ChatappChatRoomChatMessagesAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** columns and relationships of "chatapp.chat_room" */
export interface ChatappChatRoomChatParticipantsArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** columns and relationships of "chatapp.chat_room" */
export interface ChatappChatRoomChatParticipantsAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** aggregated selection of "chatapp.chat_room" */
export interface ChatappChatRoomAggregate {
  aggregate?: Maybe<ChatappChatRoomAggregateFields>;
  nodes: Array<ChatappChatRoom>;
}

/** aggregate fields of "chatapp.chat_room" */
export interface ChatappChatRoomAggregateFields {
  avg?: Maybe<ChatappChatRoomAvgFields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatRoomMaxFields>;
  min?: Maybe<ChatappChatRoomMinFields>;
  stddev?: Maybe<ChatappChatRoomStddevFields>;
  stddev_pop?: Maybe<ChatappChatRoomStddevPopFields>;
  stddev_samp?: Maybe<ChatappChatRoomStddevSampFields>;
  sum?: Maybe<ChatappChatRoomSumFields>;
  var_pop?: Maybe<ChatappChatRoomVarPopFields>;
  var_samp?: Maybe<ChatappChatRoomVarSampFields>;
  variance?: Maybe<ChatappChatRoomVarianceFields>;
}

/** aggregate fields of "chatapp.chat_room" */
export interface ChatappChatRoomAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatRoomSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_room" */
export interface ChatappChatRoomAggregateOrderBy {
  avg?: Maybe<ChatappChatRoomAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatRoomMaxOrderBy>;
  min?: Maybe<ChatappChatRoomMinOrderBy>;
  stddev?: Maybe<ChatappChatRoomStddevOrderBy>;
  stddev_pop?: Maybe<ChatappChatRoomStddevPopOrderBy>;
  stddev_samp?: Maybe<ChatappChatRoomStddevSampOrderBy>;
  sum?: Maybe<ChatappChatRoomSumOrderBy>;
  var_pop?: Maybe<ChatappChatRoomVarPopOrderBy>;
  var_samp?: Maybe<ChatappChatRoomVarSampOrderBy>;
  variance?: Maybe<ChatappChatRoomVarianceOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_room" */
export interface ChatappChatRoomArrRelInsertInput {
  data: Array<ChatappChatRoomInsertInput>;
  on_conflict?: Maybe<ChatappChatRoomOnConflict>;
}

/** aggregate avg on columns */
export interface ChatappChatRoomAvgFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by avg() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomAvgOrderBy {
  status?: Maybe<OrderBy>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_room". All fields are combined with a logical 'AND'. */
export interface ChatappChatRoomBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatRoomBoolExp>>>;
  _not?: Maybe<ChatappChatRoomBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatRoomBoolExp>>>;
  avatar?: Maybe<StringComparisonExp>;
  chat_messages?: Maybe<ChatappChatMessageBoolExp>;
  chat_participants?: Maybe<ChatappChatParticipantBoolExp>;
  created_by?: Maybe<UuidComparisonExp>;
  created_date?: Maybe<TimestampComparisonExp>;
  last_message?: Maybe<TimestampComparisonExp>;
  room_id?: Maybe<UuidComparisonExp>;
  status?: Maybe<IntComparisonExp>;
  title?: Maybe<StringComparisonExp>;
  type?: Maybe<StringComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_room" */
export enum ChatappChatRoomConstraint {
  /** unique or primary key constraint */
  ChatRoomPkey = 'chat_room_pkey',
}

/** input type for incrementing integer column in table "chatapp.chat_room" */
export interface ChatappChatRoomIncInput {
  status?: Maybe<Scalars['Int']>;
}

/** input type for inserting data into table "chatapp.chat_room" */
export interface ChatappChatRoomInsertInput {
  avatar?: Maybe<Scalars['String']>;
  chat_messages?: Maybe<ChatappChatMessageArrRelInsertInput>;
  chat_participants?: Maybe<ChatappChatParticipantArrRelInsertInput>;
  created_by?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  last_message?: Maybe<Scalars['timestamp']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface ChatappChatRoomMaxFields {
  avatar?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  last_message?: Maybe<Scalars['timestamp']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomMaxOrderBy {
  avatar?: Maybe<OrderBy>;
  created_by?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  last_message?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  title?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatRoomMinFields {
  avatar?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  last_message?: Maybe<Scalars['timestamp']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomMinOrderBy {
  avatar?: Maybe<OrderBy>;
  created_by?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  last_message?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  title?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_room" */
export interface ChatappChatRoomMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatRoom>;
}

/** input type for inserting object relation for remote table "chatapp.chat_room" */
export interface ChatappChatRoomObjRelInsertInput {
  data: ChatappChatRoomInsertInput;
  on_conflict?: Maybe<ChatappChatRoomOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_room" */
export interface ChatappChatRoomOnConflict {
  constraint: ChatappChatRoomConstraint;
  update_columns: Array<ChatappChatRoomUpdateColumn>;
  where?: Maybe<ChatappChatRoomBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_room" */
export interface ChatappChatRoomOrderBy {
  avatar?: Maybe<OrderBy>;
  chat_messages_aggregate?: Maybe<ChatappChatMessageAggregateOrderBy>;
  chat_participants_aggregate?: Maybe<ChatappChatParticipantAggregateOrderBy>;
  created_by?: Maybe<OrderBy>;
  created_date?: Maybe<OrderBy>;
  last_message?: Maybe<OrderBy>;
  room_id?: Maybe<OrderBy>;
  status?: Maybe<OrderBy>;
  title?: Maybe<OrderBy>;
  type?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_room" */
export interface ChatappChatRoomPkColumnsInput {
  room_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_room" */
export enum ChatappChatRoomSelectColumn {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  LastMessage = 'last_message',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
}

/** input type for updating data in table "chatapp.chat_room" */
export interface ChatappChatRoomSetInput {
  avatar?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['uuid']>;
  created_date?: Maybe<Scalars['timestamp']>;
  last_message?: Maybe<Scalars['timestamp']>;
  room_id?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

/** aggregate stddev on columns */
export interface ChatappChatRoomStddevFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomStddevOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_pop on columns */
export interface ChatappChatRoomStddevPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_pop() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomStddevPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate stddev_samp on columns */
export interface ChatappChatRoomStddevSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by stddev_samp() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomStddevSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate sum on columns */
export interface ChatappChatRoomSumFields {
  status?: Maybe<Scalars['Int']>;
}

/** order by sum() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomSumOrderBy {
  status?: Maybe<OrderBy>;
}

/** update columns of table "chatapp.chat_room" */
export enum ChatappChatRoomUpdateColumn {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CreatedBy = 'created_by',
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  LastMessage = 'last_message',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
}

/** aggregate var_pop on columns */
export interface ChatappChatRoomVarPopFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_pop() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomVarPopOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate var_samp on columns */
export interface ChatappChatRoomVarSampFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by var_samp() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomVarSampOrderBy {
  status?: Maybe<OrderBy>;
}

/** aggregate variance on columns */
export interface ChatappChatRoomVarianceFields {
  status?: Maybe<Scalars['Float']>;
}

/** order by variance() on columns of table "chatapp.chat_room" */
export interface ChatappChatRoomVarianceOrderBy {
  status?: Maybe<OrderBy>;
}

/** columns and relationships of "chatapp.chat_user" */
export interface ChatappChatUser {
  avatar?: Maybe<Scalars['String']>;
  call_key?: Maybe<Scalars['String']>;
  /** An array relationship */
  chat_participants: Array<ChatappChatParticipant>;
  /** An aggregated array relationship */
  chat_participants_aggregate: ChatappChatParticipantAggregate;
  chat_user_id: Scalars['uuid'];
  first_name: Scalars['String'];
  full_name?: Maybe<Scalars['String']>;
  last_name: Scalars['String'];
  last_seen?: Maybe<Scalars['timestamp']>;
  last_typed?: Maybe<Scalars['timestamp']>;
  push_key?: Maybe<Scalars['String']>;
}

/** columns and relationships of "chatapp.chat_user" */
export interface ChatappChatUserChatParticipantsArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** columns and relationships of "chatapp.chat_user" */
export interface ChatappChatUserChatParticipantsAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** aggregated selection of "chatapp.chat_user" */
export interface ChatappChatUserAggregate {
  aggregate?: Maybe<ChatappChatUserAggregateFields>;
  nodes: Array<ChatappChatUser>;
}

/** aggregate fields of "chatapp.chat_user" */
export interface ChatappChatUserAggregateFields {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<ChatappChatUserMaxFields>;
  min?: Maybe<ChatappChatUserMinFields>;
}

/** aggregate fields of "chatapp.chat_user" */
export interface ChatappChatUserAggregateFieldsCountArgs {
  columns?: Maybe<Array<ChatappChatUserSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "chatapp.chat_user" */
export interface ChatappChatUserAggregateOrderBy {
  count?: Maybe<OrderBy>;
  max?: Maybe<ChatappChatUserMaxOrderBy>;
  min?: Maybe<ChatappChatUserMinOrderBy>;
}

/** input type for inserting array relation for remote table "chatapp.chat_user" */
export interface ChatappChatUserArrRelInsertInput {
  data: Array<ChatappChatUserInsertInput>;
  on_conflict?: Maybe<ChatappChatUserOnConflict>;
}

/** Boolean expression to filter rows from the table "chatapp.chat_user". All fields are combined with a logical 'AND'. */
export interface ChatappChatUserBoolExp {
  _and?: Maybe<Array<Maybe<ChatappChatUserBoolExp>>>;
  _not?: Maybe<ChatappChatUserBoolExp>;
  _or?: Maybe<Array<Maybe<ChatappChatUserBoolExp>>>;
  avatar?: Maybe<StringComparisonExp>;
  call_key?: Maybe<StringComparisonExp>;
  chat_participants?: Maybe<ChatappChatParticipantBoolExp>;
  chat_user_id?: Maybe<UuidComparisonExp>;
  first_name?: Maybe<StringComparisonExp>;
  full_name?: Maybe<StringComparisonExp>;
  last_name?: Maybe<StringComparisonExp>;
  last_seen?: Maybe<TimestampComparisonExp>;
  last_typed?: Maybe<TimestampComparisonExp>;
  push_key?: Maybe<StringComparisonExp>;
}

/** unique or primary key constraints on table "chatapp.chat_user" */
export enum ChatappChatUserConstraint {
  /** unique or primary key constraint */
  ChatUserPkey = 'chat_user_pkey',
}

/** input type for inserting data into table "chatapp.chat_user" */
export interface ChatappChatUserInsertInput {
  avatar?: Maybe<Scalars['String']>;
  call_key?: Maybe<Scalars['String']>;
  chat_participants?: Maybe<ChatappChatParticipantArrRelInsertInput>;
  chat_user_id?: Maybe<Scalars['uuid']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  last_seen?: Maybe<Scalars['timestamp']>;
  last_typed?: Maybe<Scalars['timestamp']>;
  push_key?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface ChatappChatUserMaxFields {
  avatar?: Maybe<Scalars['String']>;
  call_key?: Maybe<Scalars['String']>;
  chat_user_id?: Maybe<Scalars['uuid']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  last_seen?: Maybe<Scalars['timestamp']>;
  last_typed?: Maybe<Scalars['timestamp']>;
  push_key?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "chatapp.chat_user" */
export interface ChatappChatUserMaxOrderBy {
  avatar?: Maybe<OrderBy>;
  call_key?: Maybe<OrderBy>;
  chat_user_id?: Maybe<OrderBy>;
  first_name?: Maybe<OrderBy>;
  full_name?: Maybe<OrderBy>;
  last_name?: Maybe<OrderBy>;
  last_seen?: Maybe<OrderBy>;
  last_typed?: Maybe<OrderBy>;
  push_key?: Maybe<OrderBy>;
}

/** aggregate min on columns */
export interface ChatappChatUserMinFields {
  avatar?: Maybe<Scalars['String']>;
  call_key?: Maybe<Scalars['String']>;
  chat_user_id?: Maybe<Scalars['uuid']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  last_seen?: Maybe<Scalars['timestamp']>;
  last_typed?: Maybe<Scalars['timestamp']>;
  push_key?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "chatapp.chat_user" */
export interface ChatappChatUserMinOrderBy {
  avatar?: Maybe<OrderBy>;
  call_key?: Maybe<OrderBy>;
  chat_user_id?: Maybe<OrderBy>;
  first_name?: Maybe<OrderBy>;
  full_name?: Maybe<OrderBy>;
  last_name?: Maybe<OrderBy>;
  last_seen?: Maybe<OrderBy>;
  last_typed?: Maybe<OrderBy>;
  push_key?: Maybe<OrderBy>;
}

/** response of any mutation on the table "chatapp.chat_user" */
export interface ChatappChatUserMutationResponse {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<ChatappChatUser>;
}

/** input type for inserting object relation for remote table "chatapp.chat_user" */
export interface ChatappChatUserObjRelInsertInput {
  data: ChatappChatUserInsertInput;
  on_conflict?: Maybe<ChatappChatUserOnConflict>;
}

/** on conflict condition type for table "chatapp.chat_user" */
export interface ChatappChatUserOnConflict {
  constraint: ChatappChatUserConstraint;
  update_columns: Array<ChatappChatUserUpdateColumn>;
  where?: Maybe<ChatappChatUserBoolExp>;
}

/** ordering options when selecting data from "chatapp.chat_user" */
export interface ChatappChatUserOrderBy {
  avatar?: Maybe<OrderBy>;
  call_key?: Maybe<OrderBy>;
  chat_participants_aggregate?: Maybe<ChatappChatParticipantAggregateOrderBy>;
  chat_user_id?: Maybe<OrderBy>;
  first_name?: Maybe<OrderBy>;
  full_name?: Maybe<OrderBy>;
  last_name?: Maybe<OrderBy>;
  last_seen?: Maybe<OrderBy>;
  last_typed?: Maybe<OrderBy>;
  push_key?: Maybe<OrderBy>;
}

/** primary key columns input for table: "chatapp.chat_user" */
export interface ChatappChatUserPkColumnsInput {
  chat_user_id: Scalars['uuid'];
}

/** select columns of table "chatapp.chat_user" */
export enum ChatappChatUserSelectColumn {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CallKey = 'call_key',
  /** column name */
  ChatUserId = 'chat_user_id',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FullName = 'full_name',
  /** column name */
  LastName = 'last_name',
  /** column name */
  LastSeen = 'last_seen',
  /** column name */
  LastTyped = 'last_typed',
  /** column name */
  PushKey = 'push_key',
}

/** input type for updating data in table "chatapp.chat_user" */
export interface ChatappChatUserSetInput {
  avatar?: Maybe<Scalars['String']>;
  call_key?: Maybe<Scalars['String']>;
  chat_user_id?: Maybe<Scalars['uuid']>;
  first_name?: Maybe<Scalars['String']>;
  full_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  last_seen?: Maybe<Scalars['timestamp']>;
  last_typed?: Maybe<Scalars['timestamp']>;
  push_key?: Maybe<Scalars['String']>;
}

/** update columns of table "chatapp.chat_user" */
export enum ChatappChatUserUpdateColumn {
  /** column name */
  Avatar = 'avatar',
  /** column name */
  CallKey = 'call_key',
  /** column name */
  ChatUserId = 'chat_user_id',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FullName = 'full_name',
  /** column name */
  LastName = 'last_name',
  /** column name */
  LastSeen = 'last_seen',
  /** column name */
  LastTyped = 'last_typed',
  /** column name */
  PushKey = 'push_key',
}

/** mutation root */
export interface MutationRoot {
  /** delete data from the table: "chatapp.chat_attachment" */
  delete_chatapp_chat_attachment?: Maybe<ChatappChatAttachmentMutationResponse>;
  /** delete single row from the table: "chatapp.chat_attachment" */
  delete_chatapp_chat_attachment_by_pk?: Maybe<ChatappChatAttachment>;
  /** delete data from the table: "chatapp.chat_message" */
  delete_chatapp_chat_message?: Maybe<ChatappChatMessageMutationResponse>;
  /** delete single row from the table: "chatapp.chat_message" */
  delete_chatapp_chat_message_by_pk?: Maybe<ChatappChatMessage>;
  /** delete data from the table: "chatapp.chat_message_visibility" */
  delete_chatapp_chat_message_visibility?: Maybe<ChatappChatMessageVisibilityMutationResponse>;
  /** delete single row from the table: "chatapp.chat_message_visibility" */
  delete_chatapp_chat_message_visibility_by_pk?: Maybe<ChatappChatMessageVisibility>;
  /** delete data from the table: "chatapp.chat_participant" */
  delete_chatapp_chat_participant?: Maybe<ChatappChatParticipantMutationResponse>;
  /** delete single row from the table: "chatapp.chat_participant" */
  delete_chatapp_chat_participant_by_pk?: Maybe<ChatappChatParticipant>;
  /** delete data from the table: "chatapp.chat_rel" */
  delete_chatapp_chat_rel?: Maybe<ChatappChatRelMutationResponse>;
  /** delete single row from the table: "chatapp.chat_rel" */
  delete_chatapp_chat_rel_by_pk?: Maybe<ChatappChatRel>;
  /** delete data from the table: "chatapp.chat_room" */
  delete_chatapp_chat_room?: Maybe<ChatappChatRoomMutationResponse>;
  /** delete single row from the table: "chatapp.chat_room" */
  delete_chatapp_chat_room_by_pk?: Maybe<ChatappChatRoom>;
  /** delete data from the table: "chatapp.chat_user" */
  delete_chatapp_chat_user?: Maybe<ChatappChatUserMutationResponse>;
  /** delete single row from the table: "chatapp.chat_user" */
  delete_chatapp_chat_user_by_pk?: Maybe<ChatappChatUser>;
  /** insert data into the table: "chatapp.chat_attachment" */
  insert_chatapp_chat_attachment?: Maybe<ChatappChatAttachmentMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_attachment" */
  insert_chatapp_chat_attachment_one?: Maybe<ChatappChatAttachment>;
  /** insert data into the table: "chatapp.chat_message" */
  insert_chatapp_chat_message?: Maybe<ChatappChatMessageMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_message" */
  insert_chatapp_chat_message_one?: Maybe<ChatappChatMessage>;
  /** insert data into the table: "chatapp.chat_message_visibility" */
  insert_chatapp_chat_message_visibility?: Maybe<ChatappChatMessageVisibilityMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_message_visibility" */
  insert_chatapp_chat_message_visibility_one?: Maybe<ChatappChatMessageVisibility>;
  /** insert data into the table: "chatapp.chat_participant" */
  insert_chatapp_chat_participant?: Maybe<ChatappChatParticipantMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_participant" */
  insert_chatapp_chat_participant_one?: Maybe<ChatappChatParticipant>;
  /** insert data into the table: "chatapp.chat_rel" */
  insert_chatapp_chat_rel?: Maybe<ChatappChatRelMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_rel" */
  insert_chatapp_chat_rel_one?: Maybe<ChatappChatRel>;
  /** insert data into the table: "chatapp.chat_room" */
  insert_chatapp_chat_room?: Maybe<ChatappChatRoomMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_room" */
  insert_chatapp_chat_room_one?: Maybe<ChatappChatRoom>;
  /** insert data into the table: "chatapp.chat_user" */
  insert_chatapp_chat_user?: Maybe<ChatappChatUserMutationResponse>;
  /** insert a single row into the table: "chatapp.chat_user" */
  insert_chatapp_chat_user_one?: Maybe<ChatappChatUser>;
  /** update data of the table: "chatapp.chat_attachment" */
  update_chatapp_chat_attachment?: Maybe<ChatappChatAttachmentMutationResponse>;
  /** update single row of the table: "chatapp.chat_attachment" */
  update_chatapp_chat_attachment_by_pk?: Maybe<ChatappChatAttachment>;
  /** update data of the table: "chatapp.chat_message" */
  update_chatapp_chat_message?: Maybe<ChatappChatMessageMutationResponse>;
  /** update single row of the table: "chatapp.chat_message" */
  update_chatapp_chat_message_by_pk?: Maybe<ChatappChatMessage>;
  /** update data of the table: "chatapp.chat_message_visibility" */
  update_chatapp_chat_message_visibility?: Maybe<ChatappChatMessageVisibilityMutationResponse>;
  /** update single row of the table: "chatapp.chat_message_visibility" */
  update_chatapp_chat_message_visibility_by_pk?: Maybe<ChatappChatMessageVisibility>;
  /** update data of the table: "chatapp.chat_participant" */
  update_chatapp_chat_participant?: Maybe<ChatappChatParticipantMutationResponse>;
  /** update single row of the table: "chatapp.chat_participant" */
  update_chatapp_chat_participant_by_pk?: Maybe<ChatappChatParticipant>;
  /** update data of the table: "chatapp.chat_rel" */
  update_chatapp_chat_rel?: Maybe<ChatappChatRelMutationResponse>;
  /** update single row of the table: "chatapp.chat_rel" */
  update_chatapp_chat_rel_by_pk?: Maybe<ChatappChatRel>;
  /** update data of the table: "chatapp.chat_room" */
  update_chatapp_chat_room?: Maybe<ChatappChatRoomMutationResponse>;
  /** update single row of the table: "chatapp.chat_room" */
  update_chatapp_chat_room_by_pk?: Maybe<ChatappChatRoom>;
  /** update data of the table: "chatapp.chat_user" */
  update_chatapp_chat_user?: Maybe<ChatappChatUserMutationResponse>;
  /** update single row of the table: "chatapp.chat_user" */
  update_chatapp_chat_user_by_pk?: Maybe<ChatappChatUser>;
}

/** mutation root */
export interface MutationRootDeleteChatappChatAttachmentArgs {
  where: ChatappChatAttachmentBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatAttachmentByPkArgs {
  chat_attachment_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatMessageArgs {
  where: ChatappChatMessageBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatMessageByPkArgs {
  chat_message_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatMessageVisibilityArgs {
  where: ChatappChatMessageVisibilityBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatMessageVisibilityByPkArgs {
  chat_message_visibility_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatParticipantArgs {
  where: ChatappChatParticipantBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatParticipantByPkArgs {
  chat_participant_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatRelArgs {
  where: ChatappChatRelBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatRelByPkArgs {
  chat_rel_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatRoomArgs {
  where: ChatappChatRoomBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatRoomByPkArgs {
  room_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootDeleteChatappChatUserArgs {
  where: ChatappChatUserBoolExp;
}

/** mutation root */
export interface MutationRootDeleteChatappChatUserByPkArgs {
  chat_user_id: Scalars['uuid'];
}

/** mutation root */
export interface MutationRootInsertChatappChatAttachmentArgs {
  objects: Array<ChatappChatAttachmentInsertInput>;
  on_conflict?: Maybe<ChatappChatAttachmentOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatAttachmentOneArgs {
  object: ChatappChatAttachmentInsertInput;
  on_conflict?: Maybe<ChatappChatAttachmentOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatMessageArgs {
  objects: Array<ChatappChatMessageInsertInput>;
  on_conflict?: Maybe<ChatappChatMessageOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatMessageOneArgs {
  object: ChatappChatMessageInsertInput;
  on_conflict?: Maybe<ChatappChatMessageOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatMessageVisibilityArgs {
  objects: Array<ChatappChatMessageVisibilityInsertInput>;
  on_conflict?: Maybe<ChatappChatMessageVisibilityOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatMessageVisibilityOneArgs {
  object: ChatappChatMessageVisibilityInsertInput;
  on_conflict?: Maybe<ChatappChatMessageVisibilityOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatParticipantArgs {
  objects: Array<ChatappChatParticipantInsertInput>;
  on_conflict?: Maybe<ChatappChatParticipantOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatParticipantOneArgs {
  object: ChatappChatParticipantInsertInput;
  on_conflict?: Maybe<ChatappChatParticipantOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatRelArgs {
  objects: Array<ChatappChatRelInsertInput>;
  on_conflict?: Maybe<ChatappChatRelOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatRelOneArgs {
  object: ChatappChatRelInsertInput;
  on_conflict?: Maybe<ChatappChatRelOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatRoomArgs {
  objects: Array<ChatappChatRoomInsertInput>;
  on_conflict?: Maybe<ChatappChatRoomOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatRoomOneArgs {
  object: ChatappChatRoomInsertInput;
  on_conflict?: Maybe<ChatappChatRoomOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatUserArgs {
  objects: Array<ChatappChatUserInsertInput>;
  on_conflict?: Maybe<ChatappChatUserOnConflict>;
}

/** mutation root */
export interface MutationRootInsertChatappChatUserOneArgs {
  object: ChatappChatUserInsertInput;
  on_conflict?: Maybe<ChatappChatUserOnConflict>;
}

/** mutation root */
export interface MutationRootUpdateChatappChatAttachmentArgs {
  _set?: Maybe<ChatappChatAttachmentSetInput>;
  where: ChatappChatAttachmentBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatAttachmentByPkArgs {
  _set?: Maybe<ChatappChatAttachmentSetInput>;
  pk_columns: ChatappChatAttachmentPkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatMessageArgs {
  _inc?: Maybe<ChatappChatMessageIncInput>;
  _set?: Maybe<ChatappChatMessageSetInput>;
  where: ChatappChatMessageBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatMessageByPkArgs {
  _inc?: Maybe<ChatappChatMessageIncInput>;
  _set?: Maybe<ChatappChatMessageSetInput>;
  pk_columns: ChatappChatMessagePkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatMessageVisibilityArgs {
  _inc?: Maybe<ChatappChatMessageVisibilityIncInput>;
  _set?: Maybe<ChatappChatMessageVisibilitySetInput>;
  where: ChatappChatMessageVisibilityBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatMessageVisibilityByPkArgs {
  _inc?: Maybe<ChatappChatMessageVisibilityIncInput>;
  _set?: Maybe<ChatappChatMessageVisibilitySetInput>;
  pk_columns: ChatappChatMessageVisibilityPkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatParticipantArgs {
  _set?: Maybe<ChatappChatParticipantSetInput>;
  where: ChatappChatParticipantBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatParticipantByPkArgs {
  _set?: Maybe<ChatappChatParticipantSetInput>;
  pk_columns: ChatappChatParticipantPkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatRelArgs {
  _inc?: Maybe<ChatappChatRelIncInput>;
  _set?: Maybe<ChatappChatRelSetInput>;
  where: ChatappChatRelBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatRelByPkArgs {
  _inc?: Maybe<ChatappChatRelIncInput>;
  _set?: Maybe<ChatappChatRelSetInput>;
  pk_columns: ChatappChatRelPkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatRoomArgs {
  _inc?: Maybe<ChatappChatRoomIncInput>;
  _set?: Maybe<ChatappChatRoomSetInput>;
  where: ChatappChatRoomBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatRoomByPkArgs {
  _inc?: Maybe<ChatappChatRoomIncInput>;
  _set?: Maybe<ChatappChatRoomSetInput>;
  pk_columns: ChatappChatRoomPkColumnsInput;
}

/** mutation root */
export interface MutationRootUpdateChatappChatUserArgs {
  _set?: Maybe<ChatappChatUserSetInput>;
  where: ChatappChatUserBoolExp;
}

/** mutation root */
export interface MutationRootUpdateChatappChatUserByPkArgs {
  _set?: Maybe<ChatappChatUserSetInput>;
  pk_columns: ChatappChatUserPkColumnsInput;
}

/** column ordering options */
export enum OrderBy {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** query root */
export interface QueryRoot {
  /** fetch data from the table: "chatapp.chat_attachment" */
  chatapp_chat_attachment: Array<ChatappChatAttachment>;
  /** fetch aggregated fields from the table: "chatapp.chat_attachment" */
  chatapp_chat_attachment_aggregate: ChatappChatAttachmentAggregate;
  /** fetch data from the table: "chatapp.chat_attachment" using primary key columns */
  chatapp_chat_attachment_by_pk?: Maybe<ChatappChatAttachment>;
  /** fetch data from the table: "chatapp.chat_message" */
  chatapp_chat_message: Array<ChatappChatMessage>;
  /** fetch aggregated fields from the table: "chatapp.chat_message" */
  chatapp_chat_message_aggregate: ChatappChatMessageAggregate;
  /** fetch data from the table: "chatapp.chat_message" using primary key columns */
  chatapp_chat_message_by_pk?: Maybe<ChatappChatMessage>;
  /** fetch data from the table: "chatapp.chat_message_visibility" */
  chatapp_chat_message_visibility: Array<ChatappChatMessageVisibility>;
  /** fetch aggregated fields from the table: "chatapp.chat_message_visibility" */
  chatapp_chat_message_visibility_aggregate: ChatappChatMessageVisibilityAggregate;
  /** fetch data from the table: "chatapp.chat_message_visibility" using primary key columns */
  chatapp_chat_message_visibility_by_pk?: Maybe<ChatappChatMessageVisibility>;
  /** fetch data from the table: "chatapp.chat_participant" */
  chatapp_chat_participant: Array<ChatappChatParticipant>;
  /** fetch aggregated fields from the table: "chatapp.chat_participant" */
  chatapp_chat_participant_aggregate: ChatappChatParticipantAggregate;
  /** fetch data from the table: "chatapp.chat_participant" using primary key columns */
  chatapp_chat_participant_by_pk?: Maybe<ChatappChatParticipant>;
  /** fetch data from the table: "chatapp.chat_rel" */
  chatapp_chat_rel: Array<ChatappChatRel>;
  /** fetch aggregated fields from the table: "chatapp.chat_rel" */
  chatapp_chat_rel_aggregate: ChatappChatRelAggregate;
  /** fetch data from the table: "chatapp.chat_rel" using primary key columns */
  chatapp_chat_rel_by_pk?: Maybe<ChatappChatRel>;
  /** fetch data from the table: "chatapp.chat_room" */
  chatapp_chat_room: Array<ChatappChatRoom>;
  /** fetch aggregated fields from the table: "chatapp.chat_room" */
  chatapp_chat_room_aggregate: ChatappChatRoomAggregate;
  /** fetch data from the table: "chatapp.chat_room" using primary key columns */
  chatapp_chat_room_by_pk?: Maybe<ChatappChatRoom>;
  /** fetch data from the table: "chatapp.chat_user" */
  chatapp_chat_user: Array<ChatappChatUser>;
  /** fetch aggregated fields from the table: "chatapp.chat_user" */
  chatapp_chat_user_aggregate: ChatappChatUserAggregate;
  /** fetch data from the table: "chatapp.chat_user" using primary key columns */
  chatapp_chat_user_by_pk?: Maybe<ChatappChatUser>;
}

/** query root */
export interface QueryRootChatappChatAttachmentArgs {
  distinct_on?: Maybe<Array<ChatappChatAttachmentSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatAttachmentOrderBy>>;
  where?: Maybe<ChatappChatAttachmentBoolExp>;
}

/** query root */
export interface QueryRootChatappChatAttachmentAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatAttachmentSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatAttachmentOrderBy>>;
  where?: Maybe<ChatappChatAttachmentBoolExp>;
}

/** query root */
export interface QueryRootChatappChatAttachmentByPkArgs {
  chat_attachment_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatMessageArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** query root */
export interface QueryRootChatappChatMessageAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** query root */
export interface QueryRootChatappChatMessageByPkArgs {
  chat_message_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatMessageVisibilityArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** query root */
export interface QueryRootChatappChatMessageVisibilityAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** query root */
export interface QueryRootChatappChatMessageVisibilityByPkArgs {
  chat_message_visibility_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatParticipantArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** query root */
export interface QueryRootChatappChatParticipantAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** query root */
export interface QueryRootChatappChatParticipantByPkArgs {
  chat_participant_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatRelArgs {
  distinct_on?: Maybe<Array<ChatappChatRelSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRelOrderBy>>;
  where?: Maybe<ChatappChatRelBoolExp>;
}

/** query root */
export interface QueryRootChatappChatRelAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatRelSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRelOrderBy>>;
  where?: Maybe<ChatappChatRelBoolExp>;
}

/** query root */
export interface QueryRootChatappChatRelByPkArgs {
  chat_rel_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatRoomArgs {
  distinct_on?: Maybe<Array<ChatappChatRoomSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRoomOrderBy>>;
  where?: Maybe<ChatappChatRoomBoolExp>;
}

/** query root */
export interface QueryRootChatappChatRoomAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatRoomSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRoomOrderBy>>;
  where?: Maybe<ChatappChatRoomBoolExp>;
}

/** query root */
export interface QueryRootChatappChatRoomByPkArgs {
  room_id: Scalars['uuid'];
}

/** query root */
export interface QueryRootChatappChatUserArgs {
  distinct_on?: Maybe<Array<ChatappChatUserSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatUserOrderBy>>;
  where?: Maybe<ChatappChatUserBoolExp>;
}

/** query root */
export interface QueryRootChatappChatUserAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatUserSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatUserOrderBy>>;
  where?: Maybe<ChatappChatUserBoolExp>;
}

/** query root */
export interface QueryRootChatappChatUserByPkArgs {
  chat_user_id: Scalars['uuid'];
}

/** expression to compare columns of type smallint. All fields are combined with logical 'AND'. */
export interface SmallintComparisonExp {
  _eq?: Maybe<Scalars['smallint']>;
  _gt?: Maybe<Scalars['smallint']>;
  _gte?: Maybe<Scalars['smallint']>;
  _in?: Maybe<Array<Scalars['smallint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['smallint']>;
  _lte?: Maybe<Scalars['smallint']>;
  _neq?: Maybe<Scalars['smallint']>;
  _nin?: Maybe<Array<Scalars['smallint']>>;
}

/** subscription root */
export interface SubscriptionRoot {
  /** fetch data from the table: "chatapp.chat_attachment" */
  chatapp_chat_attachment: Array<ChatappChatAttachment>;
  /** fetch aggregated fields from the table: "chatapp.chat_attachment" */
  chatapp_chat_attachment_aggregate: ChatappChatAttachmentAggregate;
  /** fetch data from the table: "chatapp.chat_attachment" using primary key columns */
  chatapp_chat_attachment_by_pk?: Maybe<ChatappChatAttachment>;
  /** fetch data from the table: "chatapp.chat_message" */
  chatapp_chat_message: Array<ChatappChatMessage>;
  /** fetch aggregated fields from the table: "chatapp.chat_message" */
  chatapp_chat_message_aggregate: ChatappChatMessageAggregate;
  /** fetch data from the table: "chatapp.chat_message" using primary key columns */
  chatapp_chat_message_by_pk?: Maybe<ChatappChatMessage>;
  /** fetch data from the table: "chatapp.chat_message_visibility" */
  chatapp_chat_message_visibility: Array<ChatappChatMessageVisibility>;
  /** fetch aggregated fields from the table: "chatapp.chat_message_visibility" */
  chatapp_chat_message_visibility_aggregate: ChatappChatMessageVisibilityAggregate;
  /** fetch data from the table: "chatapp.chat_message_visibility" using primary key columns */
  chatapp_chat_message_visibility_by_pk?: Maybe<ChatappChatMessageVisibility>;
  /** fetch data from the table: "chatapp.chat_participant" */
  chatapp_chat_participant: Array<ChatappChatParticipant>;
  /** fetch aggregated fields from the table: "chatapp.chat_participant" */
  chatapp_chat_participant_aggregate: ChatappChatParticipantAggregate;
  /** fetch data from the table: "chatapp.chat_participant" using primary key columns */
  chatapp_chat_participant_by_pk?: Maybe<ChatappChatParticipant>;
  /** fetch data from the table: "chatapp.chat_rel" */
  chatapp_chat_rel: Array<ChatappChatRel>;
  /** fetch aggregated fields from the table: "chatapp.chat_rel" */
  chatapp_chat_rel_aggregate: ChatappChatRelAggregate;
  /** fetch data from the table: "chatapp.chat_rel" using primary key columns */
  chatapp_chat_rel_by_pk?: Maybe<ChatappChatRel>;
  /** fetch data from the table: "chatapp.chat_room" */
  chatapp_chat_room: Array<ChatappChatRoom>;
  /** fetch aggregated fields from the table: "chatapp.chat_room" */
  chatapp_chat_room_aggregate: ChatappChatRoomAggregate;
  /** fetch data from the table: "chatapp.chat_room" using primary key columns */
  chatapp_chat_room_by_pk?: Maybe<ChatappChatRoom>;
  /** fetch data from the table: "chatapp.chat_user" */
  chatapp_chat_user: Array<ChatappChatUser>;
  /** fetch aggregated fields from the table: "chatapp.chat_user" */
  chatapp_chat_user_aggregate: ChatappChatUserAggregate;
  /** fetch data from the table: "chatapp.chat_user" using primary key columns */
  chatapp_chat_user_by_pk?: Maybe<ChatappChatUser>;
}

/** subscription root */
export interface SubscriptionRootChatappChatAttachmentArgs {
  distinct_on?: Maybe<Array<ChatappChatAttachmentSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatAttachmentOrderBy>>;
  where?: Maybe<ChatappChatAttachmentBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatAttachmentAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatAttachmentSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatAttachmentOrderBy>>;
  where?: Maybe<ChatappChatAttachmentBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatAttachmentByPkArgs {
  chat_attachment_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageOrderBy>>;
  where?: Maybe<ChatappChatMessageBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageByPkArgs {
  chat_message_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageVisibilityArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageVisibilityAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatMessageVisibilitySelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatMessageVisibilityOrderBy>>;
  where?: Maybe<ChatappChatMessageVisibilityBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatMessageVisibilityByPkArgs {
  chat_message_visibility_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatParticipantArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatParticipantAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatParticipantSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatParticipantOrderBy>>;
  where?: Maybe<ChatappChatParticipantBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatParticipantByPkArgs {
  chat_participant_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatRelArgs {
  distinct_on?: Maybe<Array<ChatappChatRelSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRelOrderBy>>;
  where?: Maybe<ChatappChatRelBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatRelAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatRelSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRelOrderBy>>;
  where?: Maybe<ChatappChatRelBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatRelByPkArgs {
  chat_rel_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatRoomArgs {
  distinct_on?: Maybe<Array<ChatappChatRoomSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRoomOrderBy>>;
  where?: Maybe<ChatappChatRoomBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatRoomAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatRoomSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatRoomOrderBy>>;
  where?: Maybe<ChatappChatRoomBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatRoomByPkArgs {
  room_id: Scalars['uuid'];
}

/** subscription root */
export interface SubscriptionRootChatappChatUserArgs {
  distinct_on?: Maybe<Array<ChatappChatUserSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatUserOrderBy>>;
  where?: Maybe<ChatappChatUserBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatUserAggregateArgs {
  distinct_on?: Maybe<Array<ChatappChatUserSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ChatappChatUserOrderBy>>;
  where?: Maybe<ChatappChatUserBoolExp>;
}

/** subscription root */
export interface SubscriptionRootChatappChatUserByPkArgs {
  chat_user_id: Scalars['uuid'];
}

/** expression to compare columns of type timestamp. All fields are combined with logical 'AND'. */
export interface TimestampComparisonExp {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
}

/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export interface UuidComparisonExp {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
}

export type GetRoomListQueryVariables = Exact<{
  userId: Scalars['uuid'];
}>;

export type GetRoomListQuery = {
  chatRooms: Array<
    Pick<ChatappChatRoom, 'avatar' | 'title' | 'type'> & {
      roomId: ChatappChatRoom['room_id'];
      lastMessageTime: ChatappChatRoom['last_message'];
    } & {
      currentUser: Array<{ lastRead: ChatappChatParticipant['last_read'] }>;
      chatParticipants: Array<{ chatUser?: Maybe<Pick<ChatappChatUser, 'avatar'>> }>;
      chatMessages: Array<
        Pick<ChatappChatMessage, 'content' | 'type'> & { createdDate: ChatappChatMessage['created_date'] }
      >;
    }
  >;
};

export type GetFirstRoomQueryVariables = Exact<{ [key: string]: never }>;

export type GetFirstRoomQuery = { chatRooms: Array<{ roomId: ChatappChatRoom['room_id'] }> };

export const GetRoomListDocument = /*#__PURE__*/ gql`
  query getRoomList($userId: uuid!) {
    chatRooms: chatapp_chat_room {
      roomId: room_id
      avatar
      lastMessageTime: last_message
      title
      type
      currentUser: chat_participants(where: { chat_user: { chat_user_id: { _eq: $userId } } }) {
        lastRead: last_read
      }
      chatParticipants: chat_participants(where: { chat_user: { chat_user_id: { _neq: $userId } } }) {
        chatUser: chat_user {
          avatar
        }
      }
      chatMessages: chat_messages(limit: 1) {
        content
        type
        createdDate: created_date
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRoomListQueryService extends Apollo.Query<GetRoomListQuery, GetRoomListQueryVariables> {
  document = GetRoomListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetFirstRoomDocument = /*#__PURE__*/ gql`
  query getFirstRoom {
    chatRooms: chatapp_chat_room(limit: 1) {
      roomId: room_id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetFirstRoomQueryService extends Apollo.Query<GetFirstRoomQuery, GetFirstRoomQueryVariables> {
  document = GetFirstRoomDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
