export interface SearchParams {
  q?: string;
}

export interface SortParams {
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
