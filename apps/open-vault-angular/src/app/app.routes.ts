import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    {
        path: 'books',
        component: HomeComponent,
        loadChildren: async () => (await import('./pages/home/home.routes')).HomeRoutes
    },
    { path: 'auth', redirectTo: '/auth/signin', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: async () =>
            (await import('./pages/auth/auth.routes')).AuthRoutes,
    },
];
