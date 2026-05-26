import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardStateService } from '../services/dashboard-state.service';
import { KpiCardComponent } from '../../shared/ui/kpi-card.component';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';

@Component({
  selector: 'app-portfolio-kpi-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, TrendColorPipe, KpiCardComponent],
  template: `
    <dl class="grid grid-cols-2 gap-4 lg:grid-cols-3">

      <app-kpi-card
        class="col-span-2 lg:col-span-1"
        label="Total value"
        [loading]="state.kpiLoading()"
        valueClass="flex items-baseline gap-2"
      >
        <span class="text-2xl font-bold text-foreground">
          {{ state.totalValue() | number:'1.0-0' }} {{ state.currency() }}
        </span>
        @let change = state.changeToday();
        @if (change !== null) {
          <span class="text-sm font-medium" [class]="change | trendColor">
            {{ change >= 0 ? '+' : '' }}{{ change | number:'1.2-2' }}%
          </span>
        }
      </app-kpi-card>

      <app-kpi-card
        label="Cash"
        [loading]="state.kpiLoading()"
      >
        {{ state.cashPercent() | number:'1.1-1' }}%
      </app-kpi-card>

      <app-kpi-card
        label="YTD return"
        [loading]="state.kpiLoading()"
        [valueClass]="'text-2xl font-bold ' + (state.ytdReturn() ?? 0 | trendColor)"
      >
        @let ytd = state.ytdReturn();
        @if (ytd !== null) {
          {{ ytd >= 0 ? '+' : '' }}{{ ytd | number:'1.2-2' }}%
        } @else {
          —
        }
      </app-kpi-card>

    </dl>
  `,
})
export class PortfolioKpiStripComponent {
  protected readonly state = inject(DashboardStateService);
}
