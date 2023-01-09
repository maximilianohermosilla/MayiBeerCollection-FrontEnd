import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Cerveza } from 'src/app/models/cerveza';
import { CervezaService } from 'src/app/services/cerveza.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { EstiloService } from 'src/app/services/estilo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { CervezaComponent } from '../cerveza/cerveza.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FilterPipe]
})
export class DashboardComponent {
  cervezas: any;  
  nombreColumnas: string[] = ["Cerveza"];
  filterText: string = "";
 
  // listaCiudades: Ciudad[] = [];
  // listaMarcas: Marca[] = [];
  // listaEstilos: Estilo[] = [];

  constructor(private servicioCerveza: CervezaService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog,
    private servicioMarca: MarcaService, private servicioEstilo: EstiloService, private servicioCiudad: CiudadService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.servicioCerveza.GetAll().subscribe((rta: any[]) => {
      this.cervezas = rta;
      console.log(this.cervezas);
    });
  }

  
  // listarCiudades(){
  //   this.servicioCiudad.GetAll().subscribe((rta: Ciudad[]) => {
  //     this.listaCiudades = rta;    
  //   });
  // }

  // listarMarcas(){
  //   this.servicioMarca.GetAll().subscribe((rta: Marca[]) => {
  //     this.listaMarcas = rta;    
  //   });
  // }

  // listarEstilos(){
  //   this.servicioEstilo.GetAll().subscribe((rta: Estilo[]) => {
  //     this.listaEstilos = rta;    
  //   });
  // }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(CervezaComponent,{
      width: '800px',disableClose: false, data: {
        title: "Nueva Cerveza",
        cerveza: null,
        // ciudades: this.listaCiudades,
        // marcas: this.listaMarcas,
        // estilos: this.listaEstilos
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })
  }

  ver(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(CervezaComponent,{
      width: '800px',disableClose: false, data: {
        title: "Editar Cerveza",
        cerveza: event,
        // ciudades: this.listaCiudades,
        // marcas: this.listaMarcas,
        // estilos: this.listaEstilos
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })

  }

  eliminar(cerveza: Cerveza){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea eliminar ${cerveza.nombre}?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicioCerveza.eliminar(cerveza.id).subscribe(result =>
            {this.ngOnInit();}
          );
        } else {
        }
      });      
  } 

   applyFilter(filterValue: string){
    this.filterText=filterValue;
     //this.cervezas.filter = filterValue.trim().toLowerCase();
   }

   searchChange(){
    console.log(this.filterText);
   }
}
