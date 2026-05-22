import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SettingsService } from './settings.service';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersDark && query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe('SettingsService', () => {
  let service: SettingsService;
  let html: HTMLElement;

  beforeEach(() => {
    mockMatchMedia(false);
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
    html = TestBed.inject(DOCUMENT).documentElement;
    TestBed.tick();
  });

  it('defaults to system theme, default density, SEK currency', () => {
    expect(service.theme()).toBe('system');
    expect(service.density()).toBe('default');
    expect(service.currency()).toBe('SEK');
  });

  it('applies .dark class when theme is set to dark', () => {
    service.theme.set('dark');
    TestBed.tick();
    expect(html.classList.contains('dark')).toBe(true);
  });

  it('removes .dark class when theme switches to light', () => {
    service.theme.set('dark');
    TestBed.tick();
    service.theme.set('light');
    TestBed.tick();
    expect(html.classList.contains('dark')).toBe(false);
  });

  it('does not apply .dark when theme is system and prefers-color-scheme is light', () => {
    service.theme.set('system');
    TestBed.tick();
    expect(html.classList.contains('dark')).toBe(false);
  });

  it('applies density class to <html>', () => {
    service.density.set('compact');
    TestBed.tick();
    expect(html.classList.contains('density-compact')).toBe(true);
  });

  it('replaces the previous density class when density changes', () => {
    service.density.set('compact');
    TestBed.tick();
    service.density.set('comfortable');
    TestBed.tick();
    expect(html.classList.contains('density-compact')).toBe(false);
    expect(html.classList.contains('density-comfortable')).toBe(true);
  });

  describe('system theme with prefers-color-scheme: dark', () => {
    beforeEach(() => {
      mockMatchMedia(true);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      service = TestBed.inject(SettingsService);
      html = TestBed.inject(DOCUMENT).documentElement;
      TestBed.tick();
    });

    it('applies .dark when system preference is dark', () => {
      expect(html.classList.contains('dark')).toBe(true);
    });

    it('does not apply .dark when theme is overridden to light', () => {
      service.theme.set('light');
      TestBed.tick();
      expect(html.classList.contains('dark')).toBe(false);
    });
  });
});
