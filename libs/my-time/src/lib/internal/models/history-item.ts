export interface HistoryItem {
  propertyName: string;
  author: {
    fullName: string;
    avatar?: string;
  };
  from: string;
  to: string;
  time: number;
  type: 'Change Status' | 'Change Escalate';
}
