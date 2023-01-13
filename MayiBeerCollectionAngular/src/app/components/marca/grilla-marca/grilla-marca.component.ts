import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MarcaComponent } from '../marca.component';


@Component({
  selector: 'app-grilla-marca',
  templateUrl: './grilla-marca.component.html',
  styleUrls: ['../../shared/style-grilla.css']
})
export class GrillaMarcaComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  title = "";

  constructor(private servicioMarca: MarcaService, public spinnerService: SpinnerService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.servicioMarca.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
    })
  }  
  
  openDialog(): void {
    const dialogRef = this.dialog.open(MarcaComponent,{
      width: '640px',disableClose: false, data: {
        title: "Nueva Marca",
        marca: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })
  }

  ver(event: any) {
    const dialogRef = this.dialog.open(MarcaComponent,{
      width: '640px',disableClose: false, data: {
        title: "Editar Marca",
        marca: event
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })

  } 

  eliminar(marca: Marca){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea eliminar ${marca.nombre}?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicioMarca.eliminar(marca.id).subscribe(result =>
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
