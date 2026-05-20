import { Currency } from '../core/currency';
import { SearchParams, SortParams } from '../core/params';

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  marketValue: number;
  weight: number;
  accountId?: string;
  currency?: Currency;
}

export interface HoldingsParams extends SearchParams, SortParams {
  accountId?: string;
}
