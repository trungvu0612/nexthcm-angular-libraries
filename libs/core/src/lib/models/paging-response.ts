export interface PagingResponse<T> {
  items: T[];
  totalPages: number;
  totalElements: number;
}
