import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexGrid,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { fromSEK } from '../../core/fx';
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
      [yaxis]="yaxis()"
      [stroke]="stroke"
      [fill]="fill"
      [dataLabels]="dataLabels"
      [tooltip]="tooltip()"
      [grid]="grid"
      [theme]="chartTheme()"
    />
  `,
})
export class PerformanceChartComponent {
  private readonly settings = inject(SettingsService);

  readonly data = input.required<PerformancePoint[]>();

  protected readonly series = computed((): ApexAxisChartSeries => {
    const currency = this.settings.currency();
    return [
      {
        name: 'Portfolio Value',
        data: this.data().map((p) => ({ x: new Date(p.date).getTime(), y: fromSEK(p.value, currency) })),
      },
    ];
  });

  protected readonly chartTheme = computed((): ApexTheme => ({
    mode: this.settings.isDark() ? 'dark' : 'light',
    monochrome: { enabled: false },
  }));

  protected readonly yaxis = computed((): ApexYAxis => {
    const currency = this.settings.currency();
    return {
      labels: {
        formatter: (value: number) =>
          `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} ${currency}`,
      },
    };
  });

  protected readonly tooltip = computed((): ApexTooltip => {
    const currency = this.settings.currency();
    return {
      x: { format: 'dd MMM yyyy' },
      y: {
        formatter: (value: number) =>
          `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} ${currency}`,
      },
    };
  });

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

  protected readonly stroke: ApexStroke = { curve: 'smooth', width: 2 };

  protected readonly fill: ApexFill = {
    type: 'gradient',
    gradient: { opacityFrom: 0.4, opacityTo: 0.05 },
  };

  protected readonly dataLabels = { enabled: false };

  protected readonly grid: ApexGrid = { strokeDashArray: 4 };
}
