import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router'; // Importe provideRouter

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Configure as rotas usando provideRouter
  ]
}).catch(err => console.error(err));