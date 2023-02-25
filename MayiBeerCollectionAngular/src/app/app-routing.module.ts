import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrillaCervezaComponent } from './components/cerveza/grilla-cerveza/grilla-cerveza.component';
import { GrillaCiudadComponent } from './components/ciudad/grilla-ciudad/grilla-ciudad.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GrillaEstiloComponent } from './components/estilo/grilla-estilo/grilla-estilo.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { GrillaMarcaComponent } from './components/marca/grilla-marca/grilla-marca.component';
import { GrillaPaisComponent } from './components/pais/grilla-pais/grilla-pais.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { GuardGuard } from './shared/guards/guard.guard';

const routes: Routes = [
  {
    path: '',    
    redirectTo: 'menu',
    pathMatch: 'full' 
  },
  {
    path: 'cervezas',
    component: GrillaCervezaComponent,
    canActivate: [GuardGuard] 
  },
  {
    path: 'marcas',
    component: GrillaMarcaComponent,
    canActivate: [GuardGuard] 
  },
  {
    path: 'estilos',
    component: GrillaEstiloComponent,
    canActivate: [GuardGuard] 
  },
  {
    path: 'ciudades',
    component: GrillaCiudadComponent,
    canActivate: [GuardGuard] 
  },
  {
    path: 'paises',
    component: GrillaPaisComponent,
    canActivate: [GuardGuard] 
  },
  {
    path: 'dashboard',
    //component: DashboardComponent, data :{ idPais :'1', idEstilo: '2', idMarca: '3', idCiudad: 4}
    component: DashboardComponent
  },
  {
    path: 'menu',
    component: LandingPageComponent
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: '404',
     component:NotfoundComponent },
  { 
    path: '**',
    redirectTo: 'menu',
    pathMatch: 'full' 
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
