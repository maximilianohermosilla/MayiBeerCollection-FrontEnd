import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpinnerService } from 'src/app/services/spinner.service';
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
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: any;
  listaPaises: Pais[] = [];
  listaPais: Pais[] = [];
  nombreColumnas: string[] = ["nombre", "acciones"];
  datos: Ciudad[] = [];
  pais: Pais = {id: 0, nombre: ""};

  constructor(private servicioCiudad: CiudadService, private servicioPais: PaisService, public spinnerService: SpinnerService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: { pais: any, ciudades: any[] }) {
      if (data.ciudades.length > 0) {
        this.datos = data.ciudades;
        this.dataSource = new MatTableDataSource<Ciudad[]>(data.ciudades);
        this.dataSource.paginator = this.paginator;  
        this.dataSource.sort = this.sort;
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
 
  announceSortChange(sort: Sort){
    if (sort.direction){
      this.liveAnnouncer.announce('Sorted${sort.direction}ending');
    }
    else{
      this.liveAnnouncer.announce('sorting cleared');
    }
  }
}