export interface PerformancePoint {
  date: string;
  value: number;
}

export interface PerformanceParams {
  currency?: string;
  from?: string;
  to?: string;
  accountIds?: string;
}
