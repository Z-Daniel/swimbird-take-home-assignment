import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-busy="true" aria-label="Loading" class="space-y-2">
      <div class="h-12 animate-pulse rounded-lg bg-surface"></div>
      <div class="h-12 animate-pulse rounded-lg bg-surface"></div>
      <div class="h-12 animate-pulse rounded-lg bg-surface"></div>
      <div class="h-12 animate-pulse rounded-lg bg-surface"></div>
      <div class="h-12 animate-pulse rounded-lg bg-surface"></div>
    </div>
  `,
})
export class SkeletonListComponent {}
