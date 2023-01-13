import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Cerveza } from 'src/app/models/cerveza';
import { Ciudad } from 'src/app/models/ciudad';
import { Estilo } from 'src/app/models/estilo';
import { Marca } from 'src/app/models/marca';
import { Pais } from 'src/app/models/pais';
import { CervezaService } from 'src/app/services/cerveza.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-cerveza',
  templateUrl: './cerveza.component.html',
  styleUrls: ['./cerveza.component.css']
})
export class CervezaComponent {
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
    ibu: 0,
    alcohol: 0,
    contenido: 0,
    observaciones: "",
    imagen: "",
    imageFile: ""
  };

  title = "";  
  listaPaises: Pais[] = [];
  listaCiudades: Ciudad[] = [];
  listaMarcas: Marca[] = [];
  listaEstilos: Estilo[] = [];

  
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";

  constructor(private formBuilder: FormBuilder, public refDialog: MatDialogRef<CervezaComponent>, public dialogoConfirmacion: MatDialog,
    private sanitizer: DomSanitizer, private servicioCiudad: CiudadService, private servicioCerveza: CervezaService, public spinnerService: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { cerveza: any, title: string, paises: any[], ciudades: any[], marcas: any[], estilos: any[] }) {
    
    this.title = "Nueva Cerveza";
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
      contenido: ['',],
      observaciones: ['',],
      imagen: ['',],
    })
  }

  save(){        
    //console.log(this.imageFileSanitized.changingThisBreaksApplicationSecurity);
    if (this.datos.id > 0){

      let _edit: Cerveza = {
        id: this.datos.id,
        nombre: this.datos.nombre,
        idMarca: this.datos.idMarca,
        nombreMarca: this.datos.nombreMarca,
        idEstilo: this.datos.idEstilo,
        nombreEstilo: this.datos.nombreEstilo,
        idCiudad: this.datos.idCiudad,
        nombreCiudad: this.datos.nombreCiudad,
        idPais: this.datos.idPais,
        nombrePais: this.datos.nombrePais,
        ibu: this.datos.ibu,
        alcohol: this.datos.alcohol,
        contenido: this.datos.contenido,
        observaciones: this.datos.observaciones,
        imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity
      };

      this.servicioCerveza.actualizar(_edit).subscribe(result =>
        {          
          this.refDialog.close(this.formGroup.value);
        }
      );
    }
    else{   
      this.datos.imagen = this.imageFileSanitized.changingThisBreaksApplicationSecurity;
      this.servicioCerveza.nuevo(this.datos).subscribe(result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "Cerveza ingresada con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
        },
        error => {
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: error.error,
              icono: "warning",
              clase: "class-error"
            }
          })
          this.refDialog.close();
          console.log(error);
        }
      );
    } 
  }

  selectFile(event: Event): void{
    const target= event.target as HTMLInputElement;
    this.fileSelected = (target.files as FileList)[0];
    //this.imageUrl= this.sant.bypassSecurityTrustUrl( window.URL.createObjectURL(this.fileSelected)) as string;    
    this.base64="Base64...";
    this.convertFileToBase64();
    
  }

  convertFileToBase64(): void{
    let reader= new FileReader();
    reader.readAsDataURL(this.fileSelected as Blob);
    reader.onloadend=()=>{
      this.base64=reader.result as string;
    }
    setTimeout(()=>{         
      this.imageFileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64)
    }, 1000); 
  }

  setearArchivo(arch: any) {
    return new Promise((resolve, reject) => {
      resolve(this.archivo = arch);
      reject('error en el asignar');
    })
  }

  listarCiudades(idPais: number){
    this.servicioCiudad.GetByPaisId(idPais).subscribe((rta: Ciudad[]) => {
      this.listaCiudades = rta;    
    });
  }

  actualizarCiudades(idPais: number){
    if(idPais > 0){
      this.listarCiudades(idPais);
    }
  }
}
