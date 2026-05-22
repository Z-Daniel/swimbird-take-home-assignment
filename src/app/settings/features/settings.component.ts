import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Currency, Density, SettingsService, Theme } from '../../core/services/settings.service';

interface Option<T> {
  value: T;
  label: string;
}

const THEME_OPTIONS: Option<Theme>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const DENSITY_OPTIONS: Option<Density>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];

const CURRENCY_OPTIONS: Option<Currency>[] = [
  { value: 'SEK', label: 'SEK' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-8 text-2xl font-bold text-(--color-text)">Settings</h1>

        <div class="space-y-8">

          <!-- Appearance -->
          <section id="appearance" class="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 space-y-6">
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-(--color-text)">Appearance</h2>
              <p class="text-sm text-(--color-text-muted)">Choose how the interface looks.</p>
            </div>

            <div class="space-y-5">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label class="text-sm font-medium text-(--color-text)">Theme</label>
                <div class="flex rounded-lg border border-(--color-border) overflow-hidden w-fit" role="group" aria-label="Theme">
                  @for (opt of themeOptions; track opt.value) {
                    <button
                      type="button"
                      (click)="settings.theme.set(opt.value)"
                      [attr.aria-pressed]="settings.theme() === opt.value"
                      class="cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      [class]="settings.theme() === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-border)'"
                    >
                      {{ opt.label }}
                    </button>
                  }
                </div>
              </div>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label class="text-sm font-medium text-(--color-text)">Density</label>
                <div class="flex rounded-lg border border-(--color-border) overflow-hidden w-fit" role="group" aria-label="Density">
                  @for (opt of densityOptions; track opt.value) {
                    <button
                      type="button"
                      (click)="settings.density.set(opt.value)"
                      [attr.aria-pressed]="settings.density() === opt.value"
                      class="cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      [class]="settings.density() === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-border)'"
                    >
                      {{ opt.label }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </section>

          <!-- Preferences -->
          <section id="preferences" class="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 space-y-6">
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-(--color-text)">Preferences</h2>
              <p class="text-sm text-(--color-text-muted)">Customise display and data preferences.</p>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label class="text-sm font-medium text-(--color-text)">Display currency</label>
              <div class="flex rounded-lg border border-(--color-border) overflow-hidden w-fit" role="group" aria-label="Currency">
                @for (opt of currencyOptions; track opt.value) {
                  <button
                    type="button"
                    (click)="settings.currency.set(opt.value)"
                    [attr.aria-pressed]="settings.currency() === opt.value"
                    class="cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    [class]="settings.currency() === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-border)'"
                  >
                    {{ opt.label }}
                  </button>
                }
              </div>
            </div>
          </section>

        </div>
    </div>
  `,
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);

  protected readonly themeOptions = THEME_OPTIONS;
  protected readonly densityOptions = DENSITY_OPTIONS;
  protected readonly currencyOptions = CURRENCY_OPTIONS;
}
