import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { PaisComponent } from './components/pais/pais.component';
import { GrillaPaisComponent } from './components/pais/grilla-pais/grilla-pais.component';
import { CiudadComponent } from './components/ciudad/ciudad.component';
import { GrillaCiudadComponent } from './components/ciudad/grilla-ciudad/grilla-ciudad.component';
import { MarcaComponent } from './components/marca/marca.component';
import { GrillaMarcaComponent } from './components/marca/grilla-marca/grilla-marca.component';
import { EstiloComponent } from './components/estilo/estilo.component';
import { GrillaEstiloComponent } from './components/estilo/grilla-estilo/grilla-estilo.component';
import { CervezaComponent } from './components/cerveza/cerveza.component';
import { GrillaCervezaComponent } from './components/cerveza/grilla-cerveza/grilla-cerveza.component';
import { SharedModule } from './shared/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    PaisComponent,
    GrillaPaisComponent,
    CiudadComponent,
    GrillaCiudadComponent,
    MarcaComponent,
    GrillaMarcaComponent,
    EstiloComponent,
    GrillaEstiloComponent,
    CervezaComponent,
    GrillaCervezaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
