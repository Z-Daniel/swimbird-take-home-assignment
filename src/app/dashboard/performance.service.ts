import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { PerformanceParams, PerformancePoint } from './performance.model';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private readonly api = inject(ApiService);

  getPerformance(params?: PerformanceParams): Observable<PerformancePoint[]> {
    return this.api.get<PerformancePoint[]>('/performance', params as Record<string, string>);
  }

  getAccountPerformance(accountId: string): Observable<PerformancePoint[]> {
    return this.api.get<PerformancePoint[]>(`/accounts/${accountId}/performance`);
  }
}
