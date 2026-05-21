import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { AccountsListComponent } from '../../accounts/ui/accounts-list.component';
import { TopHoldingsSectionComponent } from '../../accounts/features/top-holdings-section.component';
import { PerformanceChartComponent } from '../ui/performance-chart.component';
import { PortfolioKpiStripComponent } from './portfolio-kpi-strip.component';
import { DashboardStateService } from '../dashboard-state.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardStateService],
  imports: [
    SectionShellComponent,
    AccountsListComponent,
    TopHoldingsSectionComponent,
    PerformanceChartComponent,
    PortfolioKpiStripComponent,
  ],
  template: `
    @let accounts = state.accountsState;
    @let performance = state.performanceState;

    <div class="flex flex-col gap-6">

      <app-portfolio-kpi-strip />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <app-section-shell
          title="Performance"
          [loading]="performance.loading()"
          [error]="performance.error()"
          [empty]="performance.items().length === 0"
          emptyMessage="No performance data found."
          (retry)="performance.load()"
        >
          <app-performance-chart [data]="performance.items()" />
        </app-section-shell>

        <app-top-holdings-section />
      </div>

      <app-section-shell
        title="Accounts"
        [loading]="accounts.loading()"
        [error]="accounts.error()"
        [empty]="accounts.items().length === 0"
        emptyMessage="No accounts found."
        (retry)="accounts.load()"
      >
        <app-accounts-list [accounts]="accounts.items()" />
      </app-section-shell>

    </div>
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly state = inject(DashboardStateService);

  ngOnInit(): void {
    this.state.load();
  }
}
