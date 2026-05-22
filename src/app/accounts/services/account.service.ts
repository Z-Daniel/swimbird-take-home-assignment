import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Account, AccountsParams } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = inject(ApiService);

  getAccounts(params?: AccountsParams): Observable<Account[]> {
    return this.api.get<Account[]>('/accounts', params as Record<string, string>);
  }

  getAccount(id: string): Observable<Account> {
    return this.api.get<Account>(`/accounts/${id}`);
  }
}
