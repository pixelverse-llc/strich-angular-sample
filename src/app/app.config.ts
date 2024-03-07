import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({
      // handle 'back' button correctly in case deactivation guard cancels navigation
      canceledNavigationResolution: 'computed'
    }))
  ]
};
