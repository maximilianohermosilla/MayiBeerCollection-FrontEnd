import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';
import { PaisService } from 'src/app/services/pais.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CiudadComponent } from '../ciudad.component';

@Component({
  selector: 'app-grilla-ciudad',
  templateUrl: './grilla-ciudad.component.html',
  styleUrls: ['../../shared/style-grilla.css']
})
export class GrillaCiudadComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: any;
  listaPaises: Pais[] = [];
  nombreColumnas: string[] = ["nombre", "pais", "acciones"];

  constructor(private servicioCiudad: CiudadService, private servicioPais: PaisService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog) { }

  ngOnInit(): void {
    this.servicioCiudad.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
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
        title: "Nuevo Ciudad",
        ciudad: null,
        paises: this.listaPaises
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