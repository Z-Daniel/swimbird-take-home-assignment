import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/app-config';
import { SettingsService } from './core/settings.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: APP_CONFIG, useValue: { apiBaseUrl: environment.apiBaseUrl } },
    // Eagerly instantiate SettingsService so theme and density classes are
    // applied to <html> before first render, preventing flash of unstyled content.
    provideEnvironmentInitializer(() => inject(SettingsService)),
  ],
};
