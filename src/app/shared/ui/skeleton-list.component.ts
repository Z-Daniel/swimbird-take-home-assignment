import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-busy="true" aria-label="Loading" class="space-y-2">
      @for (_ of rows(); track $index) {
        <div class="h-12 animate-pulse rounded-lg bg-(--color-surface)"></div>
      }
    </div>
  `,
})
export class SkeletonListComponent {
  readonly count = input(5);
  protected readonly rows = computed(() => Array(this.count()));
}
