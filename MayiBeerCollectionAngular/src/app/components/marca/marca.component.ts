import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Marca = {id: 0, nombre: "", imagen : "", };
  title = "";
  
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
  imgResultBeforeCompress:string = "";
  imgResultAfterCompress:string = "";

  constructor(private servicioMarca: MarcaService, public spinnerService: SpinnerService, private imageCompress: NgxImageCompressService,
     private formBuilder: FormBuilder, public refDialog: MatDialogRef<MarcaComponent>,
      private sanitizer: DomSanitizer, public dialogoConfirmacion: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { marca: any; title: string; }) {
    
    this.title = "Nueva Marca";

    if (data.marca != undefined) {
      this.datos = data.marca;
      this.title = data.title;     
      this.data.marca.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.marca.imagen;
    }
    else{      
      this.imageFileSanitized = this.defaultImage;
    }

    this.formGroup = this.formBuilder.group({
      nombre: ['',[Validators.required]],            
      imagen: "",
      imageFile: ""
    })
  }
  
  ngOnInit(): void {
    
  }

  save(){
    this.datos.imagen = this.imageFileSanitized.changingThisBreaksApplicationSecurity;
    let _edit: Marca = {id: this.datos.id, nombre: this.datos.nombre,
      imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity};
    if (this.datos.id > 0){
      this.servicioMarca.actualizar(_edit).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);                  
          this.dialogoConfirmacion.open(DialogComponent, {
            width: '400px', data: {
              titulo: "Confirmación",
              mensaje: "Marca actualizada con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => 
        {
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
      this.servicioMarca.nuevo(_edit).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "Marca ingresada con éxito",
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
  
  selectFile(event: any) {
    this.spinnerService.show();
    const target= event.target as HTMLInputElement;
    this.fileSelected = (target.files as FileList)[0];
    //this.imageUrl= this.sant.bypassSecurityTrustUrl( window.URL.createObjectURL(this.fileSelected)) as string;    
    this.base64="Base64...";
    //this.convertFileToBase64();


    var fileName : any;
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

  compressFile(image: any ,fileName: any, originalFile: File) {
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(300*300)
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
}