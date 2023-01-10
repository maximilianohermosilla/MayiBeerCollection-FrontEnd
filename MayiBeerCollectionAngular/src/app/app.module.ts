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
import { BannerTitleComponent } from './components/shared/banner-title/banner-title.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GrillaPaisCiudadComponent } from './components/pais/grilla-pais-ciudad/grilla-pais-ciudad.component';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/shared/dialog/dialog.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

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
    GrillaCervezaComponent,
    BannerTitleComponent,
    NotfoundComponent,
    ConfirmDialogComponent,
    DashboardComponent,
    GrillaPaisCiudadComponent,
    FilterPipe,
    DialogComponent,
    LandingPageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,    
    BrowserAnimationsModule,
    SharedModule
  ],
  exports: [
    FilterPipe
  ],
  providers: [FilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
