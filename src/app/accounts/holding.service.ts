import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Holding, HoldingsParams } from './holding.model';

@Injectable({ providedIn: 'root' })
export class HoldingService {
  private readonly api = inject(ApiService);

  getHoldings(accountId: string): Observable<Holding[]> {
    return this.api.get<Holding[]>(`/accounts/${accountId}/holdings`);
  }

  getAllHoldings(params?: HoldingsParams): Observable<Holding[]> {
    return this.api.get<Holding[]>('/holdings', params as Record<string, string>);
  }
}
