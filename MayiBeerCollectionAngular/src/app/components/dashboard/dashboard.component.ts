import { Component, Inject, Injectable, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { CervezaComponent } from '../cerveza/cerveza.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Params } from '@angular/router';
import { Busqueda } from 'src/app/models/busqueda';
import { SpinnerService } from 'src/app/services/spinner.service';
import { CardviewComponent } from './cardview/cardview.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FilterPipe]
})

@Injectable({
  providedIn: 'root'
})

export class DashboardComponent {  
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  cervezas: Cerveza[] = [];  
  cervezasFiltered: Cerveza[] = [];  
  nombreColumnas: string[] = ["Cerveza"];
  filterText: string = "";
 
  listaPaises: Pais[] = [];
  listaCiudades: Ciudad[] = [];
  listaMarcas: Marca[] = [];
  listaEstilos: Estilo[] = [];

  busqueda: Busqueda = {
    idCiudad : 0,
    idMarca : 0,
    idPais : 0,
    idEstilo : 0
  }
  data: any;
  formGroup: FormGroup;
  myParam: string = "";
  noResults: boolean = true;
  paisSelected: Pais = {id: 0,nombre: ''};
  marcaSelected: Marca = {id: 0,nombre: ''};
  estiloSelected: Estilo = {id: 0,nombre: ''};

  titulo = "Búsqueda";
  defaultImage = "/assets/img/default.png";
  defaultImageCheck = "/assets/img/check-all.png";

  filterCount: number = 0;

  constructor(private servicioCerveza: CervezaService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private formBuilder: FormBuilder, public spinnerService: SpinnerService,
    private servicioMarca: MarcaService, private servicioEstilo: EstiloService, private servicioCiudad: CiudadService, private servicioPais: PaisService,
    private route: ActivatedRoute){
      this.formGroup = this.formBuilder.group({           
        marca: ['',],
        estilo: ['',],
        pais: ['',],
        ciudad: ['',]
      })
    }

  ngOnInit(): void {
    // this.servicioCerveza.GetAll().subscribe((rta: any[]) => {
    //   this.cervezas = rta;          
    // })
    this.listarPaises();
    this.listarMarcas();
    this.listarEstilos();    
    this.spinnerService.show();
    this.route.queryParams.subscribe(params => {
      this.busqueda.idCiudad = Number(params['idCiudad']) || 0;
      this.busqueda.idMarca = Number(params['idMarca']) || 0;
      this.busqueda.idPais =  Number(params['idPais']) || 0;
      this.busqueda.idEstilo =  Number(params['idEstilo']) || 0;
    });
  }

  listarPaises(){
    this.servicioPais.GetAllProxy().subscribe((rta: Ciudad[]) => {
      this.listaPaises = rta;    
    });
  }

  listarMarcas(){
   this.servicioMarca.GetAllProxy().subscribe((rta: Marca[]) => {
     this.listaMarcas = rta;    
   });
  }

  listarEstilos(){
   this.servicioEstilo.GetAllProxy().subscribe((rta: Estilo[]) => {
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
      this.ngOnInit();
    })
  }
  

  ver(event: any) {
    const dialogRef = this.dialog.open(CardviewComponent,{
      width: '600px',
      disableClose: false,
      maxWidth: '90vw',
      data: {
        title: event.nombre,
        cerveza: event,    
        paises: this.listaPaises,
        ciudades: this.listaCiudades,
        marcas: this.listaMarcas,
        estilos: this.listaEstilos    
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      this.ngOnInit();
    })

  }

   applyFilter(filterValue: string){
    this.filterText=filterValue;
     //this.cervezas.filter = filterValue.trim().toLowerCase();
   }

   listarCiudadesById(idPais: number){
    this.servicioCiudad.GetByPaisId(idPais).subscribe((rta: Ciudad[]) => {
      this.listaCiudades = rta;    
    });
  }

   actualizarCiudades(idPais: number){
    this.onChangeFilter();
    if(idPais > 0){
      this.listarCiudadesById(idPais);
    }
  }

  onChangeFilter(){
    this.noResults = true;
    this.filterCount++;
    if(this.filterCount >= 4){
      setTimeout(() => {
        this.servicioCerveza.GetBusqueda(this.busqueda).subscribe((rta: any[]) => {
          this.cervezas = rta;   
          this.cervezasFiltered = rta.slice(0, 10);;   
          this.noResults = rta == null || rta == undefined;
          //this.noResults = this.cervezas.length == 0? true: false;
        });      
        this.clearSelectedItems();        
        if (this.busqueda.idCiudad! > 0 || this.busqueda.idMarca! > 0 || this.busqueda.idEstilo! > 0 || this.busqueda.idPais! > 0){
          this.refreshSelected();
          this.titulo = "Resultados de la búsqueda";        
        }
        else{
          this.titulo = "Búsqueda";
        }
      }, 1000);
    }
  }

  clearSelectedItems(){
    this.paisSelected = {id: 0,nombre: ''};
    this.marcaSelected = {id: 0,nombre: ''};
    this.estiloSelected = {id: 0,nombre: ''};
  }

  refreshSelected(){    
    if (this.busqueda.idPais! > 0 ){
      this.servicioPais.GetById(this.busqueda.idPais || 0).subscribe((rta: Pais) => {
        this.paisSelected = rta;  
        console.log(rta);  
      });
    }
    if (this.busqueda.idMarca! > 0 ){
      this.servicioMarca.GetById(this.busqueda.idMarca || 0).subscribe((rta: Marca) => {
        this.marcaSelected = rta;  
        console.log(rta);  
      });
    }
    if (this.busqueda.idEstilo! > 0 ){
      this.servicioEstilo.GetById(this.busqueda.idEstilo || 0).subscribe((rta: Estilo) => {
        this.estiloSelected = rta;    
        console.log(rta);
      });
    }
  }

  onPageChange($event: any) {
    this.cervezasFiltered =  this.cervezas.slice($event.pageIndex*$event.pageSize, $event.pageIndex*$event.pageSize + $event.pageSize);
  }

  onPaginateChange(data: any) {
    this.cervezasFiltered = this.cervezas.slice(0, data.pageSize);
  }
}
