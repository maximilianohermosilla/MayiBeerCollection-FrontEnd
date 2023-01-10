import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Estilo } from 'src/app/models/estilo';
import { EstiloService } from 'src/app/services/estilo.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EstiloComponent } from '../estilo.component';

@Component({
  selector: 'app-grilla-estilo',
  templateUrl: './grilla-estilo.component.html',
  styleUrls: ['../../shared/style-grilla.css']
})
export class GrillaEstiloComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  title = "";

  constructor(private servicioEstilo: EstiloService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog) { }

  ngOnInit(): void {
    this.servicioEstilo.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
  }

  openDialog(): void {  
    const dialogRef = this.dialog.open(EstiloComponent,{
      width: '640px',disableClose: false, data: {
        title: "Nuevo Estilo",
        estilo: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })
  }

  ver(event: any) {
    const dialogRef = this.dialog.open(EstiloComponent,{
      width: '640px',disableClose: false, data: {
        title: "Editar Estilo",
        estilo: event
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
    })

  } 

  eliminar(estilo: Estilo){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea eliminar ${estilo.nombre}?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicioEstilo.eliminar(estilo.id).subscribe(result =>
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
