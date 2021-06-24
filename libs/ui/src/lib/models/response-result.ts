export interface ResponseData<T> {
  items: Partial<T>[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ResponseResult<T> {
  code: string;
  data: ResponseData<T>;
}
