import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import {MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from 'src/app/models/pais';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

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

  constructor(private servicioPais: PaisService, public spinnerService: SpinnerService,
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

  ver(element: any) {
    console.log(element);
  }

  save(){
    if (this.datos.id > 0){
      console.log("update");
      let _editPais: Pais = {id: this.datos.id, nombre: this.datos.nombre,
        imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity};
      this.servicioPais.actualizar(_editPais).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);                   
          this.dialogoConfirmacion.open(DialogComponent, {
            width: '400px', data: {
              titulo: "Confirmación",
              mensaje: "País actualizado con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => 
        {
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
      this.servicioPais.nuevo(this.datos).subscribe(
        result =>
        {
          this.refDialog.close(this.formGroup.value);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "País ingresado con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.hide();
        },
        error => {
          if (error.status == 401){
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
  
  selectFile(event: Event): void{
    this.spinnerService.show();
    const target= event.target as HTMLInputElement;
    this.fileSelected = (target.files as FileList)[0];
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
      this.imageFileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64);
      this.spinnerService.hide();
    }, 1000); 
  }
}
