export interface GlobalId {
  entity: string;
  cdoId: string;
}

export interface CommitMetadata {
  author: string;
  properties: any[];
  commitDate: string;
  commitDateInstant: string;
  id: number;
}

export interface Changes {
  changeType: string;
  globalId: GlobalId;
  commitMetadata: CommitMetadata;
}

export interface TrackingHistory {
  changes: Changes[];
  commitMetadata: CommitMetadata;
}
