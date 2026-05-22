import { Currency } from '../../core/models/currency.model';
import { PaginationParams, SearchParams, SortParams } from '../../core/models/params.model';

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
