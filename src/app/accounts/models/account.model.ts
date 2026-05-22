import { Currency } from '../../core/models/currency.model';
import { SearchParams, SortParams } from '../../core/models/params.model';

export type AccountStatus = 'active' | 'restricted' | 'closed';
export type AccountType = 'Investment' | 'Cash';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  changeToday: number;
  riskLevel: RiskLevel;
  owner: string;
  status: AccountStatus;
  openedAt: string;
}

export interface AccountsParams extends SearchParams, SortParams {
  status?: string;
  currency?: string;
}
