import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaisComponent } from '../pais.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Pais } from 'src/app/models/pais';
import { GrillaCiudadComponent } from '../../ciudad/grilla-ciudad/grilla-ciudad.component';
import { GrillaPaisCiudadComponent } from '../grilla-pais-ciudad/grilla-pais-ciudad.component';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { SpinnerService } from 'src/app/services/spinner.service';


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

  constructor(private servicioPais: PaisService, public spinnerService: SpinnerService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog) { }

  ngOnInit(): void {
    this.servicioPais.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);      
      this.dataSource.paginator = this.paginator;
    })
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(PaisComponent,{
      width: '640px',disableClose: false, data: {
        title: "Nuevo Pais",
        pais: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      if(res != true && res != undefined){
        this.dialogClose("País insertado con éxito", "");
      }
      this.ngOnInit();
    })
  }

  ver(event: any) {
    const dialogRef = this.dialog.open(PaisComponent,{
      width: '640px',disableClose: false, data: {
        title: "Editar Pais",
        pais: event
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      this.ngOnInit();
    })

  }  

  verCiudades(event: any) {
    const dialogRef = this.dialog.open(GrillaPaisCiudadComponent,{
      width: '640px',disableClose: false, data: {
        title: "Ciudades",
        pais: event,
        ciudades: event.ciudades
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      this.ngOnInit();
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
            {    
              this.spinnerService.hide();
              this.ngOnInit();
            });
        }
      });      
  }
  

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dialogClose(_mensaje: string, _icono: string){
    this.dialogoConfirmacion.open(DialogComponent, {
      data: {
        mensaje: _mensaje,
        icon: _icono
      }
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {        
          this.ngOnInit();
        }   
    }); 
  }

}
