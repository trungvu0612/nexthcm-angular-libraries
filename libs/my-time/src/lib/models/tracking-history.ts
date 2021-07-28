export interface TrackingHistory {
	changes: TrackingHistoryChanges[];
	commitMetadata: TrackingHistoryCommitMetadata;
}
export interface TrackingHistoryChangesGlobalId {
	entity: string;
	cdoId: string;
}
export interface TrackingHistoryChangesCommitMetadata {
	author: string;
	properties: any[];
	commitDate: string;
	commitDateInstant: string;
	id: number;
}
export interface TrackingHistoryChanges {
	changeType: string;
	globalId: TrackingHistoryChangesGlobalId;
	commitMetadata: TrackingHistoryChangesCommitMetadata;
	property: string;
	propertyChangeType: string;
	left: number;
	right: number;
}
export interface TrackingHistoryCommitMetadata {
	author: string;
	properties: any[];
	commitDate: string;
	commitDateInstant: string;
	id: number;
}
