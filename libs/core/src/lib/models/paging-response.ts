export interface PagingResponse<T> {
  code: string;
  data: {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
}
