import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'default' | 'comfortable';
export type Currency = 'SEK' | 'USD' | 'EUR';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly doc = inject(DOCUMENT);
  private readonly systemDark = signal(false);

  readonly theme = signal<Theme>('system');
  readonly density = signal<Density>('default');
  readonly currency = signal<Currency>('SEK');

  readonly isDark = computed(() => {
    const theme = this.theme();
    const systemDark = this.systemDark();
    return theme === 'dark' || (theme === 'system' && systemDark);
  });

  constructor() {
    this.initSystemDark();
    this.initDomEffect();
  }

  private initSystemDark(): void {
    const mediaQuery = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery) {
      this.systemDark.set(mediaQuery.matches);
      mediaQuery.addEventListener('change', (e) => this.systemDark.set(e.matches));
    }
  }

  private initDomEffect(): void {
    effect(() => {
      const theme = this.theme();
      const systemDark = this.systemDark();
      const density = this.density();

      const isDark = theme === 'dark' || (theme === 'system' && systemDark);
      const html = this.doc.documentElement;

      html.classList.toggle('dark', isDark);
      html.classList.remove('density-compact', 'density-default', 'density-comfortable');
      html.classList.add(`density-${density}`);
    });
  }
}
