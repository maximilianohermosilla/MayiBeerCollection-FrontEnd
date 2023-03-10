import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Estilo } from 'src/app/models/estilo';
import { EstiloService } from 'src/app/services/estilo.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EstiloComponent } from '../estilo.component';
import { MatSort, Sort } from '@angular/material/sort'
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-grilla-estilo',
  templateUrl: './grilla-estilo.component.html',
  styleUrls: ['../../shared/style-grilla.css']
})
export class GrillaEstiloComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  title = "";

  constructor(private servicioEstilo: EstiloService, public spinnerService: SpinnerService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.servicioEstilo.GetAllProxy().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //console.log(rta);
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
      this.ngOnInit();
    })
  }

  ver(event: any) {
    this.servicioEstilo.GetById(event.id).subscribe((rta: Estilo) => { 
      const dialogRef = this.dialog.open(EstiloComponent,{
        width: '640px',disableClose: false, data: {
          title: "Editar Estilo",
          estilo: rta
        } 
      });

      dialogRef.afterClosed().subscribe( res => {      
        this.ngOnInit();
      })
    });
  } 

  eliminar(estilo: Estilo){
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `??Est?? seguro de que desea eliminar ${estilo.nombre}?`
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

  announceSortChange(sort: Sort){
    if (sort.direction){
      this.liveAnnouncer.announce('Sorted${sort.direction}ending');
    }
    else{
      this.liveAnnouncer.announce('sorting cleared');
    }
  }
}
