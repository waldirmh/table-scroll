// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CartaComponent } from './pages/carta/carta.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  // { path: 'carta', component: CartaComponent },
];
