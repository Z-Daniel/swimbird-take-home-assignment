import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { EmptyStateComponent } from './empty-state.component';
import { ErrorMessageComponent } from './error-message.component';
import { SkeletonListComponent } from './skeleton-list.component';

@Component({
  selector: 'app-section-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonListComponent, ErrorMessageComponent, EmptyStateComponent],
  template: `
    <section [attr.aria-labelledby]="headingId()">
      <h2 [id]="headingId()" class="mb-4 text-lg font-semibold text-(--color-text)">
        {{ title() }}
      </h2>

      @if (loading()) {
        <app-skeleton-list />
      } @else if (error()) {
        <app-error-message
          [message]="error()!"
          [showRetry]="true"
          (retry)="retry.emit()"
        />
      } @else if (empty()) {
        <app-empty-state [message]="emptyMessage()" />
      } @else {
        <ng-content />
      }
    </section>
  `,
})
export class SectionShellComponent {
  readonly title = input.required<string>();
  readonly loading = input.required<boolean>();
  readonly error = input<string | null>(null);
  readonly empty = input.required<boolean>();
  readonly emptyMessage = input('No data found.');
  readonly retry = output<void>();

  protected readonly headingId = computed(() =>
    `${this.title().toLowerCase().replace(/\s+/g, '-')}-heading`,
  );
}
