import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import {MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from 'src/app/models/pais';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Pais = {id: 0, nombre: ""};
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
  

  constructor(private servicioPais: PaisService, public spinnerService: SpinnerService, private imageCompress: NgxImageCompressService,
     private formBuilder: FormBuilder, public refDialog: MatDialogRef<PaisComponent>,
     private sanitizer: DomSanitizer, public dialogoConfirmacion: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { pais: any, title: string }) {
    
    this.title = "Nuevo pais";

    if (data.pais != undefined) {
      this.datos = data.pais;
      this.title = data.title;           
      this.data.pais.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.pais.imagen;
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
    let _editPais: Pais = {id: this.datos.id, nombre: this.datos.nombre,
      imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity};
    if (this.datos.id > 0){
      this.servicioPais.actualizar(_editPais).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);                   
          this.dialogoConfirmacion.open(DialogComponent, {
            width: '400px', data: {
              titulo: "Confirmaci??n",
              mensaje: "Pa??s actualizado con ??xito",
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
      this.servicioPais.nuevo(_editPais).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmaci??n",
              mensaje: "Pa??s ingresado con ??xito",
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
              titulo: "Error " + error.status,
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


    var  fileName : any;
    this.file = event.target.files[0];
    fileName = this.file['name'];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl,fileName)
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    }
    imgResultBeforeCompress:string = "";
    imgResultAfterCompress:string = "";

    compressFile(image: any ,fileName: any) {
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
          this.fileSelected = (imageBlob);
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
