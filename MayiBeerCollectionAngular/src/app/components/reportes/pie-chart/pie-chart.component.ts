import { Component, Input } from '@angular/core';
import { CervezaService } from 'src/app/services/cerveza.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Reporte } from 'src/app/models/reporte';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input() totalMarcas: Reporte[] = [];
  @Input() totalEstilos: Reporte[] = [];
  @Input() totalPaises: Reporte[] = [];
  @Input() totalCiudades: Reporte[] = [];
  dataSource: any[] = [];
  view: [number, number] = [700, 250];
  title: string = "";

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    //domain: ['#f00', '#0f0', '#0ff', '#F1F', 'blue'],
    domain: ['#6f42c1', '#0dcaf0', '#0d6efd', '#65cd23', '#ffc107', '#fd7e14', '#dc3545']
  };

  constructor(private servicioCerveza: CervezaService) {
    // this.servicioCerveza.GetAllMarcas().subscribe((rta: any[]) => {
    //   this.dataSource = rta;
    //   setTimeout(() => {
    //     Object.assign(this, { rta });        
    //   }, 2000);
    // });

  }

  ngOnInit(){
   setTimeout(() => {
    var marcas = this.totalMarcas;
    if(this.totalMarcas.length > 0){
      this.title="Marcas";
      this.dataSource = this.totalMarcas;
      Object.assign(this, { totalMarcas:this });      
    }
    if(this.totalEstilos.length > 0){
      this.title="Estilos";
      this.dataSource = this.totalEstilos;
      Object.assign(this, { totalEstilos:this });      
    }
    if(this.totalPaises.length > 0){
      this.title="Paises";
      this.dataSource = this.totalPaises;
      Object.assign(this, { totalPaises:this });      
    }
    if(this.totalCiudades.length > 0){
      this.title="Ciudades";
      this.dataSource = this.totalCiudades;
      Object.assign(this, { totalCiudades:this });      
    }
   }, 1000);
  }

  onSelect(data: any): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
