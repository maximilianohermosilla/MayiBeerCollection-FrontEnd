import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AnonymousSubject } from 'rxjs/internal/Subject';
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
import { SpinnerService } from 'src/app/services/spinner.service';
import { CiudadComponent } from '../ciudad/ciudad.component';
import { EstiloComponent } from '../estilo/estilo.component';
import { MarcaComponent } from '../marca/marca.component';
import { PaisComponent } from '../pais/pais.component';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-cerveza',
  templateUrl: './cerveza.component.html',
  styleUrls: ['./cerveza.component.css']
})
export class CervezaComponent{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Cerveza = {
    id: 0,
    nombre: "",
    idMarca: 0,
    nombreMarca: "",
    idEstilo: undefined,
    nombreEstilo: "",
    idCiudad: undefined,
    nombreCiudad: "",
    idPais: undefined,
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
  idPaisSelected: number = 0;
  
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";

  //compress
  file: any;
  localUrl: any;
  localCompressedURl:any;
  sizeOfOriginalImage:number = 0;
  sizeOFCompressedImage:number = 0;



  constructor(private formBuilder: FormBuilder, public refDialog: MatDialogRef<CervezaComponent>, public dialogoConfirmacion: MatDialog, private imageCompress: NgxImageCompressService,
    private sanitizer: DomSanitizer, private servicioCiudad: CiudadService, private servicioCerveza: CervezaService, public spinnerService: SpinnerService,
    private servicioMarca: MarcaService, private servicioEstilo: EstiloService, private servicioPais: PaisService,
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
      contenido: ['',[Validators.required]],  
      observaciones: ['',],
      imagen: ['',],
    })
  }

  save(){  
    this.spinnerService.show();      
    //console.log(this.imageFileSanitized.changingThisBreaksApplicationSecurity);
    let _edit: Cerveza = {
      id: this.datos.id,
      nombre: this.datos.nombre,
      idMarca: this.datos.idMarca,
      nombreMarca: this.datos.nombreMarca,
      idEstilo: this.datos.idEstilo != 0? this.datos.idEstilo: undefined,
      nombreEstilo: this.datos.nombreEstilo,
      idCiudad: this.datos.idCiudad != 0? this.datos.idCiudad: undefined,
      nombreCiudad: this.datos.nombreCiudad,
      idPais: this.datos.idPais != 0? this.datos.idPais: undefined,
      nombrePais: this.datos.nombrePais,
      ibu: this.datos.ibu,
      alcohol: this.datos.alcohol,
      contenido: this.datos.contenido,
      observaciones: this.datos.observaciones,
      imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity
    };
    if (this.datos.id > 0){

      this.servicioCerveza.actualizar(_edit).subscribe(result =>
        {          
          this.refDialog.close(this.formGroup.value);          
          this.dialogoConfirmacion.open(DialogComponent, {
            width: '400px', data: {
              titulo: "Confirmaci??n",
              mensaje: "Cerveza actualizada con ??xito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => {    
          if (error.status == 401 || error.status == 403){
            error.error = "Usuario no autorizado";
          }      
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
          this.spinnerService.hide();
        }
      );
    }
    else{   
      this.datos.imagen = this.imageFileSanitized.changingThisBreaksApplicationSecurity;
      this.servicioCerveza.nuevo(_edit).subscribe(result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmaci??n",
              mensaje: "Cerveza ingresada con ??xito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => {
          if (error.status == 401 || error.status == 403){
            error.error = "Usuario no autorizado";
          }
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
          this.spinnerService.hide();
        }
      );
    } 
  }

  /*selectFile(event: Event): void{
    this.spinnerService.show();
    const target= event.target as HTMLInputElement;
    this.fileSelected = (target.files as FileList)[0];
    //this.imageUrl= this.sant.bypassSecurityTrustUrl( window.URL.createObjectURL(this.fileSelected)) as string;    
    this.base64="Base64...";
    this.convertFileToBase64();
    
  }*/

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
    this.idPaisSelected = idPais;
    if(idPais > 0){
      this.listarCiudades(idPais);
    }
  }

  selectFile(event: any) {
    this.spinnerService.show();
    const target= event.target as HTMLInputElement;
    this.fileSelected = (target.files as FileList)[0];
    //this.imageUrl= this.sant.bypassSecurityTrustUrl( window.URL.createObjectURL(this.fileSelected)) as string;    
    this.base64="Base64...";
    //this.convertFileToBase64();


    var  fileName : any;
    this.file = event.target.files[0];
    fileName = this.file['name'];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl,fileName, this.file)
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    }
    imgResultBeforeCompress:string = "";
    imgResultAfterCompress:string = "";

    compressFile(image: any ,fileName: any, originalFile: File) {
      var orientation = -1;
      this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
      console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          this.localCompressedURl = result;
          this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
          console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
          // create file from byte
          const imageName = fileName;
          // call method that creates a blob from dataUri
          const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
          //imageFile created below is the new compressed file which can be send to API in form data
          const imageFile = new File([result], imageName, { type: 'image/jpeg' });
          //this.fileSelected = (imageBlob);
          this.fileSelected = this.sizeOfOriginalImage > 0.05? imageBlob: originalFile;
          this.convertFileToBase64();
        }
    );}

    dataURItoBlob(dataURI: any) {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      return blob;
    }  
    
    convertFileToBase64(): void{
      let reader= new FileReader();
      reader.readAsDataURL(this.fileSelected as Blob);
      reader.onloadend=()=>{
        this.base64=reader.result as string;
      }
      setTimeout(()=>{         
        this.imageFileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64);
        this.spinnerService.hide();
      }, 1000); 
    }

    openDialog(tipo: string): void {        
      switch (tipo) {
        case 'marca':
           this.openABMMarca();
          break;
        case 'estilo':
           this.openABMEstilo();
        break;
        case 'pais':
           this.openABMPais();
        break;
        case 'ciudad':
          this.openABMCiudad();
       break;
        default:        
          break;
      }    
    }
  
    openABMMarca(){
      const dialogRef = this.dialogoConfirmacion.open(MarcaComponent,{
        width: '640px', minWidth: '340px',disableClose: false, data: {
          title: "Nueva Marca",
          marca: null
        } 
      });
  
      dialogRef.afterClosed().subscribe( res => {
        this.listarMarcas();
      })
    }
  
    openABMEstilo(){
      const dialogRef = this.dialogoConfirmacion.open(EstiloComponent,{
        width: '640px', minWidth: '340px',disableClose: false, data: {
          title: "Nuevo Estilo",
          estilo: null
        } 
      });
  
      dialogRef.afterClosed().subscribe( res => {
        this.listarEstilos();
      })
    }
  
    openABMPais(){
      const dialogRef = this.dialogoConfirmacion.open(PaisComponent,{
        width: '640px', minWidth: '340px',disableClose: false, data: {
          title: "Nuevo Pa??s",
          pais: null
        } 
      });
  
      dialogRef.afterClosed().subscribe( res => {
        this.listarPaises();
      })
    }
  
    openABMCiudad(){
      const dialogRef = this.dialogoConfirmacion.open(CiudadComponent,{
        width: '640px', minWidth: '340px',disableClose: false, data: {
          title: "Nueva Ciudad",
          ciudad: null,
          paises: this.listaPaises,
          idPais: this.idPaisSelected
        } 
      });
  
      dialogRef.afterClosed().subscribe( res => {
        this.listarCiudades(this.idPaisSelected);
      })
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

}
