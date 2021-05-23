export interface MyRequestData {
  office: string;
  date: Date;
  fromDate: Date;
  toDate: Date;
  spentTime: number;
  day: number;
  timeIn: string;
  timeOut: string;
  totalTime: number;
  status: string;
  reason: string;
  comment: string;
  sentTo: string;
}

export interface DialogRequestData {
  item: MyRequestData;
  title: string;
  group: string;
}
