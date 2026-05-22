import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { PaginatedResult } from '../../core/paginated-result';
import { CreateTransactionPayload, Transaction, TransactionsParams } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = inject(ApiService);

  getTransactions(accountId: string, params?: TransactionsParams): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(`/accounts/${accountId}/transactions`, params as Record<string, string | number>);
  }

  getAllTransactions(params?: TransactionsParams): Observable<PaginatedResult<Transaction>> {
    return this.api.get<PaginatedResult<Transaction>>('/transactions', params as Record<string, string | number>);
  }

  createTransaction(accountId: string, payload: CreateTransactionPayload): Observable<Transaction> {
    return this.api.post<Transaction>(`/accounts/${accountId}/transactions`, payload);
  }
}
