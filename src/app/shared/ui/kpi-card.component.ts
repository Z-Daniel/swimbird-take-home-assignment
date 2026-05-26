import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-border bg-surface px-5 py-4">
      @if (loading()) {
        <div class="space-y-2 animate-pulse">
          <div class="h-3 w-24 rounded bg-border"></div>
          <div class="h-7 w-32 rounded bg-border"></div>
        </div>
      } @else {
        <dt class="text-xs font-medium uppercase tracking-wide text-muted">{{ label() }}</dt>
        <dd class="mt-1" [class]="valueClass()">
          <ng-content />
        </dd>
      }
    </div>
  `,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly loading = input.required<boolean>();
  readonly valueClass = input<string>('text-2xl font-bold text-foreground');
}
