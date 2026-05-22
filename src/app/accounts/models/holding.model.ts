import { Currency } from '../../core/models/currency.model';
import { SearchParams, SortParams } from '../../core/models/params.model';

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
