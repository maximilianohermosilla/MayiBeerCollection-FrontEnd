import { Component } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { CervezaService } from 'src/app/services/cerveza.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  marcas: Reporte[] = [];
  estilos: Reporte[] = [];
  paises: Reporte[] = [];
  ciudades: Reporte[] = [];
  cantidades: Reporte[] = [];

  constructor(private servicioCerveza: CervezaService) {
    this.servicioCerveza.GetAllMarcas().subscribe((rta: any[]) => {
      this.marcas = rta;   
    });
    this.servicioCerveza.GetAllEstilos().subscribe((rta: any[]) => {
      this.estilos = rta;   
    });
    this.servicioCerveza.GetAllPaises().subscribe((rta: any[]) => {
      this.paises = rta;   
    });
    this.servicioCerveza.GetAllCiudades().subscribe((rta: any[]) => {
      this.ciudades = rta;   
    });
    this.servicioCerveza.GetCantidades().subscribe((rta: any[]) => {
      this.cantidades = rta;   
    });
  }
}
