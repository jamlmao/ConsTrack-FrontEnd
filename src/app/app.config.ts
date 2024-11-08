import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync()],
 
};

export const AppConfig = {
  baseUrl: 'https://magenta-chinchilla-572784.hostingersite.com',
  imageUrl: 'https://magenta-chinchilla-572784.hostingersite.com'
  // baseUrl: 'http://127.0.0.1:8000',
  // imageUrl: 'http://localhost:8000'
};
