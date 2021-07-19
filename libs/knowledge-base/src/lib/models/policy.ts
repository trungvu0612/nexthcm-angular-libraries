export interface Policy {
  id?: string;
  thumbnail?: string;
  createdDate?: number | Date;
  topic?: string;
  shortDescription?: string;
  longDescription?: string;
}

export interface PolicyDetail {
  title: string;
  image: string;
  time: string;
  content: string[];
}

export interface PolicyUpdated {
  title: string;
  name: string;
  image: string;
  time: string;
  content: string;
}
