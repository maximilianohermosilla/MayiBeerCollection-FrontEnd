import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Cerveza } from 'src/app/models/cerveza';
import { Ciudad } from 'src/app/models/ciudad';
import { Estilo } from 'src/app/models/estilo';
import { Marca } from 'src/app/models/marca';
import { Pais } from 'src/app/models/pais';
import { CervezaService } from 'src/app/services/cerveza.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { EstiloService } from 'src/app/services/estilo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CervezaComponent } from '../cerveza.component';

@Component({
  selector: 'app-grilla-cerveza',
  templateUrl: './grilla-cerveza.component.html',
  styleUrls: ['./grilla-cerveza.component.css']
})
export class GrillaCervezaComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "marca", "estilo", "ibu", "alcohol", "contenido", "ciudad", "acciones"];
 
  listaPaises: Pais[] = [];
  listaCiudades: Ciudad[] = [];
  listaMarcas: Marca[] = [];
  listaEstilos: Estilo[] = [];

  constructor(private servicioCerveza: CervezaService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, public spinnerService: SpinnerService,
    private servicioMarca: MarcaService, private servicioEstilo: EstiloService, private servicioCiudad: CiudadService, private servicioPais: PaisService) { }

  ngOnInit(): void {
    this.servicioCerveza.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    });
    this.listarPaises();
    this.listarCiudades();
    this.listarMarcas();
    this.listarEstilos();
  }

  listarPaises(){
    this.servicioPais.GetAll().subscribe((rta: Ciudad[]) => {
      this.listaPaises = rta;    
    });
  }
  
  listarCiudades(){
    this.servicioCiudad.GetAll().subscribe((rta: Ciudad[]) => {
      this.listaCiudades = rta;    
    });
  }

  listarMarcas(){
    this.servicioMarca.GetAll().subscribe((rta: Marca[]) => {
      this.listaMarcas = rta;    
    });
  }

  listarEstilos(){
    this.servicioEstilo.GetAll().subscribe((rta: Estilo[]) => {
      this.listaEstilos = rta;    
    });
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(CervezaComponent,{
      width: '800px',disableClose: false, data: {
        title: "Nueva Cerveza",
        cerveza: null,
        paises: this.listaPaises,
        ciudades: this.listaCiudades,
        marcas: this.listaMarcas,
        estilos: this.listaEstilos
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
        paises: this.listaPaises,
        ciudades: this.listaCiudades,
        marcas: this.listaMarcas,
        estilos: this.listaEstilos
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}