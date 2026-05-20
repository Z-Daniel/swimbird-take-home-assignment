import { Currency } from '../core/currency';
import { PaginationParams, SearchParams, SortParams } from '../core/params';

export type TransactionType = 'trade' | 'dividend' | 'fee' | 'interest' | 'cash';

export interface CreateTransactionPayload {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface Transaction extends CreateTransactionPayload {
  id: string;
  currency: Currency;
  accountId?: string;
}

export interface ValidationError {
  error: string;
  fields: Partial<Record<keyof CreateTransactionPayload, string>>;
}

export interface TransactionsParams extends SearchParams, SortParams, PaginationParams {
  type?: string;
  from?: string;
  to?: string;
}
