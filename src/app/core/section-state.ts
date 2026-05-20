import { DestroyRef, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export class SectionState<T> {
  readonly loading = signal(true);
  readonly items = signal<T[]>([]);
  readonly error = signal<string | null>(null);

  private sub: Subscription | null = null;

  constructor(
    private readonly fetch: () => Observable<T[]>,
    private readonly errorMessage: string,
    destroyRef: DestroyRef,
  ) {
    destroyRef.onDestroy(() => this.sub?.unsubscribe());
  }

  load(): void {
    this.sub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.sub = this.fetch().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.errorMessage);
        this.loading.set(false);
      },
    });
  }
}
