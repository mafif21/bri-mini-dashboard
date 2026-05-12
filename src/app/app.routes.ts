import { Routes } from '@angular/router';
import { authGuard } from './pages/guards/auth.guard';
import { MainLayout } from './pages/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'accounts/:id',
        loadComponent: () =>
          import('./pages/account-detail/account-detail').then((m) => m.AccountDetail),
      },
      {
        path: 'transfer',
        loadComponent: () => import('./pages/transfer/transfer').then((m) => m.Transfer),
      },
      {
        path: 'bulk-transfer',
        loadComponent: () =>
          import('./pages/bulk-transfer/bulk-transfer').then((m) => m.BulkTransfer),
      },
    ],
  },

  // error case page
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
