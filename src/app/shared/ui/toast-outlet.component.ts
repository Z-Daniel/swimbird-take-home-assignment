import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      aria-live="polite"
      aria-atomic="false"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          role="status"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg"
          [class]="toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'"
        >
          <span>{{ toast.message }}</span>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="cursor-pointer rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastOutletComponent {
  protected readonly toastService = inject(ToastService);
}
