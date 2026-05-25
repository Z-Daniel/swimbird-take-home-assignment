import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 text-center">
      <p class="text-sm text-(--color-text-muted)"><ng-content /></p>
    </div>
  `,
})
export class EmptyStateComponent {}
