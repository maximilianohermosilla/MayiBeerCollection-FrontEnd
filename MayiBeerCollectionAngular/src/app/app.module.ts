import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaisComponent } from './components/pais/pais.component';
import { CiudadComponent } from './components/ciudad/ciudad.component';
import { ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';


import { GrillaPaisComponent } from './components/pais/grilla-pais/grilla-pais.component';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { GrillaCiudadComponent } from './components/ciudad/grilla-ciudad/grilla-ciudad.component';

@NgModule({
  declarations: [
    AppComponent,
    PaisComponent,
    CiudadComponent,
    GrillaPaisComponent,
    ToolbarComponent,
    GrillaCiudadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
