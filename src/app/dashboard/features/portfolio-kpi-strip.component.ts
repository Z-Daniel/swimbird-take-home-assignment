import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardStateService } from '../services/dashboard-state.service';
import { KpiCardComponent } from '../../shared/ui/kpi-card.component';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';
import { SignedNumberPipe } from '../../shared/ui/signed-number.pipe';

@Component({
  selector: 'app-portfolio-kpi-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, TrendColorPipe, KpiCardComponent, SignedNumberPipe],
  template: `
    <dl class="grid grid-cols-2 gap-(--density-gap) lg:grid-cols-3">

      <app-kpi-card
        class="col-span-2 lg:col-span-1"
        label="Total value"
        [loading]="state.kpiLoading()"
        valueClass="flex items-baseline gap-2"
      >
      @let totalValue = state.totalValue();
      @if (totalValue !== null) {
        <span class="text-2xl font-bold text-foreground">
          {{ state.totalValue() | number:'1.0-0' }} {{ state.currency() }}
        </span>
        @let change = state.changeToday();
        @if (change !== null) {
          <span class="text-sm font-medium" [class]="change | trendColor">
            {{ change | signedNumber }}%
          </span>
        }
      } @else {
        —
      }
      </app-kpi-card>

      <app-kpi-card
        label="Cash"
        [loading]="state.kpiLoading()"
      >
        @if (state.cashPercent() !== null) {
          {{ state.cashPercent() | number:'1.1-1' }}%
        } @else {
          —
        }
      </app-kpi-card>

      <app-kpi-card
        label="YTD return"
        [loading]="state.kpiLoading()"
        [valueClass]="'text-2xl font-bold ' + (state.ytdReturn() ?? 0 | trendColor)"
      >
        @let ytd = state.ytdReturn();
        @if (ytd !== null) {
          {{ ytd | signedNumber }}%
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
