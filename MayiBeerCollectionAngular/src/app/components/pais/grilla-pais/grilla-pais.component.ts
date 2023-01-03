import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PaisComponent } from '../pais.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Pais } from 'src/app/models/pais';


@Component({
  selector: 'app-grilla-pais',
  templateUrl: './grilla-pais.component.html',
  styleUrls: ['./grilla-pais.component.css']
})
export class GrillaPaisComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  title = "";

  constructor(private servicioPais: PaisService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog) { }

  ngOnInit(): void {
    this.servicioPais.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);      
      this.dataSource.paginator = this.paginator;
    })
  }

  ver(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(PaisComponent,{
      width: '640px',disableClose: false, data: {
        title: "Editar Pais",
        pais: event
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
    })

  }

  eliminar(pais: Pais){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea eliminar ${pais.nombre}?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.servicioPais.eliminar(pais.id).subscribe(result =>
            {this.ngOnInit();}
          );
        } else {
        }
      });      
  }
  

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    console.log("Nuevo pais");
    const dialogRef = this.dialog.open(PaisComponent,{
      width: '640px',disableClose: false, data: {
        title: "Nuevo Pais",
        pais: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
      this.ngOnInit();
    })
}
}
