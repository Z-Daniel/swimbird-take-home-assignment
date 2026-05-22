import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexGrid,
  ApexStroke,
  ApexTheme,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { SettingsService } from '../../core/services/settings.service';
import { PerformancePoint } from '../models/performance.model';

@Component({
  selector: 'app-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartComponent],
  template: `
    <apx-chart
      [series]="series()"
      [chart]="chartConfig"
      [xaxis]="xaxis"
      [yaxis]="yaxis"
      [stroke]="stroke"
      [fill]="fill"
      [dataLabels]="dataLabels"
      [tooltip]="tooltip"
      [grid]="grid"
      [theme]="chartTheme()"
    />
  `,
})
export class PerformanceChartComponent {
  private readonly settings = inject(SettingsService);

  readonly data = input.required<PerformancePoint[]>();

  protected readonly series = computed((): ApexAxisChartSeries => [
    {
      name: 'Portfolio Value',
      data: this.data().map((p) => ({ x: new Date(p.date).getTime(), y: p.value })),
    },
  ]);

  protected readonly chartTheme = computed((): ApexTheme => ({
    mode: this.settings.isDark() ? 'dark' : 'light',
    monochrome: { enabled: false },
  }));

  protected readonly chartConfig: ApexChart = {
    type: 'area',
    height: 250,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
  };

  protected readonly xaxis: ApexXAxis = {
    type: 'datetime',
    labels: { datetimeUTC: false },
  };

  protected readonly yaxis: ApexYAxis = {
    labels: {
      formatter: (value: number) =>
        value.toLocaleString('sv-SE', { maximumFractionDigits: 0 }),
    },
  };

  protected readonly stroke: ApexStroke = { curve: 'smooth', width: 2 };

  protected readonly fill: ApexFill = {
    type: 'gradient',
    gradient: { opacityFrom: 0.4, opacityTo: 0.05 },
  };

  protected readonly dataLabels = { enabled: false };

  protected readonly tooltip = { x: { format: 'dd MMM yyyy' } };

  protected readonly grid: ApexGrid = { strokeDashArray: 4 };
}
