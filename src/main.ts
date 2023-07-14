import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import * as mapboxgl from 'mapbox-gl';

(mapboxgl.accessToken as any) = 'pk.eyJ1IjoiZ3JlZ29hcmNlbnRhIiwiYSI6ImNsMjFhNXFyYzBnMm0zY28zbmdyMXcyZXkifQ.GXo6nIXO1Qbcbyu7SkaQ8g'

if (!navigator.geolocation) {
  throw new Error("El navegador no soporta la geolocalización")
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
