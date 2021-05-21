export interface Policy {
  id: string;
  title: string;
  image: string;
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
