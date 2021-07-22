export interface Knowledge {
  id: string;
  thumbnail: string;
  createdDate: number;
  topic: string;
  shortDescription: string;
  longDescription: string;
}

export interface Category {
  id: string;
  creator: string;
  status: boolean;
  description: string;
}
