import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="py-12 text-center">
      <p class="text-sm text-(--color-text-muted)">{{ message() }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
}
