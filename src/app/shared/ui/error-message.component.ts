import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="alert" class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
      <p class="text-sm text-red-700 dark:text-red-300">{{ message() }}</p>
      @if (showRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-2 cursor-pointer text-sm font-medium text-red-700 underline hover:no-underline dark:text-red-300"
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
