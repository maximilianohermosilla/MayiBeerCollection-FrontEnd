import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrillaCervezaComponent } from './components/cerveza/grilla-cerveza/grilla-cerveza.component';
import { GrillaCiudadComponent } from './components/ciudad/grilla-ciudad/grilla-ciudad.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GrillaEstiloComponent } from './components/estilo/grilla-estilo/grilla-estilo.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { GrillaMarcaComponent } from './components/marca/grilla-marca/grilla-marca.component';
import { GrillaPaisComponent } from './components/pais/grilla-pais/grilla-pais.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';

const routes: Routes = [
  {
    path: '',    
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'cervezas',
    component: GrillaCervezaComponent
  },
  {
    path: 'marcas',
    component: GrillaMarcaComponent
  },
  {
    path: 'estilos',
    component: GrillaEstiloComponent
  },
  {
    path: 'ciudades',
    component: GrillaCiudadComponent
  },
  {
    path: 'paises',
    component: GrillaPaisComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: NotfoundComponent
  },
  {
    path: 'menu',
    component: LandingPageComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
