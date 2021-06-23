export interface Policy {
  id?: string;
  orgId?: string;
  status?: number;
  publishedDate?: number;
  thumbnail?: string;
  createdDate?: number | Date;
  mobileThumbnail?: string;
  slug?: string;
  topic?: string;
  longDescription?: string;
  shortDescription?: string;
}
