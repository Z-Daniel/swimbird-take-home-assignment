import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="alert" class="rounded-lg border border-danger-dim bg-danger-bg p-4">
      <p class="text-sm text-danger-fg">{{ message() }}</p>
      @if (showRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 cursor-pointer text-sm font-medium text-danger-fg underline hover:no-underline"
        >
          Try again
        </button>
      }
    </div>
  `,
})
export class ErrorMessageComponent {
  readonly message = input('Something went wrong. Please try again.');
  readonly showRetry = input(false);
  readonly retry = output();
}
