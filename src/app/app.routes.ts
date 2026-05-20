import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/features/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'accounts/:id',
    loadComponent: () =>
      import('./accounts/features/account-detail.component').then((m) => m.AccountDetailComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/features/settings.component').then((m) => m.SettingsComponent),
  },
];
