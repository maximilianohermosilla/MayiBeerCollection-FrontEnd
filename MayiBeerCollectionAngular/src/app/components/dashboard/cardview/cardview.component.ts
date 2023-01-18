import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Cerveza } from 'src/app/models/cerveza';
import { Ciudad } from 'src/app/models/ciudad';
import { Estilo } from 'src/app/models/estilo';
import { Marca } from 'src/app/models/marca';
import { Pais } from 'src/app/models/pais';
import { CervezaService } from 'src/app/services/cerveza.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenService } from 'src/app/services/token.service';
import { CervezaComponent } from '../../cerveza/cerveza.component';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.css']
})
export class CardviewComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Cerveza = {
    id: 0,
    nombre: "",
    idMarca: 0,
    nombreMarca: "",
    idEstilo: 0,
    nombreEstilo: "",
    idCiudad: 0,
    nombreCiudad: "",
    idPais: 0,
    nombrePais: "",
    ibu: undefined,
    alcohol: undefined,
    contenido: undefined,
    observaciones: "",
    imagen: "",
    imageFile: ""
  };

  title = "";  
  listaPaises: Pais[] = [];
  listaCiudades: Ciudad[] = [];
  listaMarcas: Marca[] = [];
  listaEstilos: Estilo[] = [];

  admin: boolean = true;
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";
  isAdmin: boolean = false;




  constructor(private formBuilder: FormBuilder, public refDialog: MatDialogRef<CervezaComponent>, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private sanitizer: DomSanitizer, private servicioCiudad: CiudadService, private servicioCerveza: CervezaService, public spinnerService: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { cerveza: any, title: string, paises: any[], ciudades: any[], marcas: any[], estilos: any[] }) {   
    this.title = "Cerveza";
    if (data.cerveza != undefined) {
      this.datos = data.cerveza;
      this.title = data.title;
      this.listaPaises = data.paises;
      this.listaCiudades = data.ciudades;
      this.listaMarcas = data.marcas;
      this.listaEstilos = data.estilos;
      this.data.cerveza.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.cerveza.imagen;
      //this.imageFileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.cerveza.imageFile)
      //this.imageFileSanitized = this.sanitizer.bypassSecurityTrustStyle('data:image/jpeg;base64,' + this.data.cerveza.imageFile)
    }
    else{
      this.title = data.title;
      this.listaPaises = data.paises;
      this.listaCiudades = data.ciudades;
      this.listaMarcas = data.marcas;
      this.listaEstilos = data.estilos;
      this.imageFileSanitized = this.defaultImage;
    }

    this.formGroup = this.formBuilder.group({
      nombre: ['',[Validators.required]],      
      marca: ['',[Validators.required]],
      estilo: ['',],
      pais: ['',],
      ciudad: ['',],
      ibu: ['',],
      alcohol: ['',],
      contenido: ['',[Validators.required]],  
      observaciones: ['',],
      imagen: ['',],
    })
  }
 
  ngOnInit(): void {
    this.isAdmin  = (this.tokenService.getToken())? true: false;
  }

  editar(event: Cerveza){
    const dialogRef = this.dialogoConfirmacion.open(CervezaComponent,{
      width: '800px',disableClose: false, data: {
        title: "Editar Cerveza",
        cerveza: event,
        paises: this.listaPaises,
        ciudades: this.listaCiudades,
        marcas: this.listaMarcas,
        estilos: this.listaEstilos
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      console.log("Cerraste el dialog");
    })

  }
}
