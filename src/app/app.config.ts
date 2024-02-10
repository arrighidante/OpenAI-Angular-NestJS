import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideMarkdown()],
};
