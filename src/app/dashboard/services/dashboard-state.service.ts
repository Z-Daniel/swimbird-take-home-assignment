import { computed, DestroyRef, inject, Injectable } from '@angular/core';
import { fromSEK, toSEK } from '../../core/fx';
import { SectionState } from '../../core/section-state';
import { SettingsService } from '../../core/services/settings.service';
import { AccountService } from '../../accounts/services/account.service';
import { PerformanceService } from './performance.service';

@Injectable()
export class DashboardStateService {
  private readonly accountService = inject(AccountService);
  private readonly performanceService = inject(PerformanceService);
  private readonly settings = inject(SettingsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly accountsState = new SectionState(
    () => this.accountService.getAccounts(),
    'Failed to load accounts.',
    this.destroyRef,
  );

  readonly performanceState = new SectionState(
    () => this.performanceService.getPerformance(),
    'Failed to load performance data.',
    this.destroyRef,
  );

  readonly currency = this.settings.currency;

  readonly kpiLoading = computed(
    () => this.accountsState.loading() || this.performanceState.loading(),
  );

  private readonly totalValueInSEK = computed(() => {
    const accounts = this.accountsState.items();
    if (accounts.length === 0) return null;
    return this.accountsState.items().reduce((sum, a) => sum + toSEK(a.balance, a.currency), 0);
  });

  readonly totalValue = computed(() => {
    const currency = this.settings.currency();
    const totalValueInSEK = this.totalValueInSEK();
    if (totalValueInSEK === null) return null;
    return fromSEK(
      totalValueInSEK,
      currency,
    );
  });

  readonly changeToday = computed((): number | null => {
    const totalSEK = this.totalValueInSEK();
    const accounts = this.accountsState.items();
    if (totalSEK === null || totalSEK === 0 || accounts.length === 0) return null;
    return (
      accounts.reduce((sum, a) => sum + toSEK(a.balance, a.currency) * a.changeToday, 0) / totalSEK
    );
  });

  readonly cashPercent = computed(() => {
    const accounts = this.accountsState.items();
    const totalSEK = accounts.reduce((sum, a) => sum + toSEK(a.balance, a.currency), 0);
    if (totalSEK === 0) return 0;
    const cashSEK = accounts
      .filter((a) => a.type === 'Cash')
      .reduce((sum, a) => sum + toSEK(a.balance, a.currency), 0);
    return (cashSEK / totalSEK) * 100;
  });

  readonly ytdReturn = computed((): number | null => {
    const points = this.performanceState.items();
    const currentYear = new Date().getFullYear().toString();
    const ytdPoints = points.filter((p) => p.date.startsWith(currentYear));
    if (ytdPoints.length < 2) return null;
    const first = ytdPoints[0].value;
    const last = ytdPoints[ytdPoints.length - 1].value;
    return ((last - first) / first) * 100;
  });

  load(): void {
    this.accountsState.load();
    this.performanceState.load();
  }
}
