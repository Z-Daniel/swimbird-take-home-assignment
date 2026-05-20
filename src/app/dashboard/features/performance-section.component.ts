import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SectionState } from '../../core/section-state';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { PerformanceService } from '../performance.service';
import { PerformanceChartComponent } from '../ui/performance-chart.component';

@Component({
  selector: 'app-performance-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShellComponent, PerformanceChartComponent],
  template: `
    <app-section-shell
      title="Performance"
      [loading]="state.loading()"
      [error]="state.error()"
      [empty]="state.items().length === 0"
      emptyMessage="No performance data found."
      (retry)="state.load()"
    >
      <app-performance-chart [data]="state.items()" />
    </app-section-shell>
  `,
})
export class PerformanceSectionComponent implements OnInit {
  private readonly performanceService = inject(PerformanceService);

  protected readonly state = new SectionState(
    () => this.performanceService.getPerformance(),
    'Failed to load performance data.',
    inject(DestroyRef),
  );

  ngOnInit(): void {
    this.state.load();
  }
}
