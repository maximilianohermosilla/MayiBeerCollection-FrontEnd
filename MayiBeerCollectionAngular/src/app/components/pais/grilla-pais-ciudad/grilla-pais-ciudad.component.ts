import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';
import { PaisService } from 'src/app/services/pais.service';
import { CiudadComponent } from '../../ciudad/ciudad.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-grilla-pais-ciudad',
  templateUrl: './grilla-pais-ciudad.component.html',
  styleUrls: ['./grilla-pais-ciudad.component.css']
})
export class GrillaPaisCiudadComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  listaPaises: Pais[] = [];
  listaPais: Pais[] = [];
  nombreColumnas: string[] = ["nombre", "pais", "acciones"];
  datos: Ciudad[] = [];
  pais: Pais = {id: 0, nombre: ""};

  constructor(private servicioCiudad: CiudadService, private servicioPais: PaisService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { pais: any, ciudades: any[] }) {

      //if (data.ciudades != undefined) {
      if (data.ciudades.length > 0) {
        this.datos = data.ciudades;
        this.dataSource = new MatTableDataSource<Ciudad[]>(data.ciudades);
        this.dataSource.paginator = this.paginator;  
      }
      this.pais.id = data.pais.id;
      this.pais.nombre = data.pais.nombre;
      this.listaPais.push(this.pais);
    }

  ngOnInit(): void {    
    this.listarPaises();
  }

  listarPaises(){
    this.servicioPais.GetAll().subscribe((rta: Pais[]) => {
      this.listaPaises = rta;    
    });
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(CiudadComponent,{
      width: '640px',disableClose: false, data: {
        title: "Nueva Ciudad",
        ciudad: null,
        paises: this.listaPais
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })
  }

  ver(event: any) {
    const dialogRef = this.dialog.open(CiudadComponent,{
      width: '640px',disableClose: false, data: {
        title: "Editar Ciudad",
        ciudad: event,
        paises: this.listaPaises
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      dialogRef.close('Cierro!');
      this.ngOnInit();
    })

  }

  eliminar(ciudad: Ciudad){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea eliminar ${ciudad.nombre}?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicioCiudad.eliminar(ciudad.id).subscribe(result =>
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