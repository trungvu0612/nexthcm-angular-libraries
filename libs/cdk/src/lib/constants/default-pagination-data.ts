import { Pagination } from '../models';

export const DEFAULT_PAGINATION_DATA: Pagination = {
  items: [],
  page: 0,
  size: 10,
  totalItems: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
};
