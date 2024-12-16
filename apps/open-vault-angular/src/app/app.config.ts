import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { metaReducers, reducers } from './shared/store/reducers';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './shared/interceptors/request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore(reducers, { metaReducers }),
    provideHttpClient(
      withFetch(), 
      withInterceptors([requestInterceptor])
    )
  ],
};
