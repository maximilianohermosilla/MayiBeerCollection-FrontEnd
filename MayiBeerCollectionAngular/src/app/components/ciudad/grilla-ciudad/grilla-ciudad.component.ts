import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';
import { PaisService } from 'src/app/services/pais.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CiudadComponent } from '../ciudad.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-grilla-ciudad',
  templateUrl: './grilla-ciudad.component.html',
  styleUrls: ['../../shared/style-grilla.css']
})
export class GrillaCiudadComponent  implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  dataSource: any;
  listaPaises: Pais[] = [];
  nombreColumnas: string[] = ["nombre", "pais", "acciones"];

  constructor(private servicioCiudad: CiudadService, private servicioPais: PaisService, public spinnerService: SpinnerService,
     public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.servicioCiudad.GetAll().subscribe((rta: any[]) => {
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.listarPaises();
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
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

  announceSortChange(sortState: any) {
    console.log(sortState);
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}