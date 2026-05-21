import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavItemComponent } from './nav-item.component';

const MOBILE_LINK_CLASS =
  'block rounded-md px-3 py-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:bg-(--color-border) hover:text-(--color-text)';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavItemComponent],
  template: `
    <header class="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-surface)">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-(--density-padding) py-3">
        <!-- Logo + desktop nav grouped on the left -->
        <div class="flex items-center gap-6">
          <a routerLink="/dashboard" class="text-lg font-semibold text-(--color-text) no-underline">Portfolio</a>

          <!-- Desktop nav (sm+) -->
          <nav aria-label="Main navigation" class="hidden sm:block">
            <ul class="flex gap-1" role="list">
              <app-nav-item link="/dashboard">Dashboard</app-nav-item>
              <app-nav-item link="/settings">Settings</app-nav-item>
            </ul>
          </nav>
        </div>

        <!-- Hamburger button (< sm) -->
        <button
          type="button"
          class="sm:hidden cursor-pointer rounded-md p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text) focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          (click)="toggleMenu()"
        >
          @if (menuOpen()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        </button>
      </div>

      <!-- Mobile menu (< sm) -->
      @if (menuOpen()) {
        <nav id="mobile-menu" aria-label="Mobile navigation" class="sm:hidden border-t border-(--color-border) px-(--density-padding) py-3">
          <ul class="flex flex-col gap-1" role="list">
            <app-nav-item link="/dashboard" [linkClass]="mobileLinkClass" (click)="closeMenu()">Dashboard</app-nav-item>
            <app-nav-item link="/settings" [linkClass]="mobileLinkClass" (click)="closeMenu()">Settings</app-nav-item>
          </ul>
        </nav>
      }
    </header>
  `,
})
export class AppHeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly mobileLinkClass = MOBILE_LINK_CLASS;

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
