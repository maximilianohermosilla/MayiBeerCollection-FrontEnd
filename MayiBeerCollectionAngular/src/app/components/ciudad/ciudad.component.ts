import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css']
})
export class CiudadComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Ciudad = {id: 0, nombre: "", idPais: 0, nombrePais: ""};
  title = "";
  listaPaises: any[] = [];

  constructor(private servicioCiudad: CiudadService, private formBuilder: FormBuilder,
     public refDialog: MatDialogRef<CiudadComponent>, public spinnerService: SpinnerService,
     public dialogoConfirmacion: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { ciudad: any, title: string, paises: any[] }) {
    
    this.title = "Nueva ciudad";
    if (data.ciudad != undefined) {
      this.datos = data.ciudad;
      this.title = data.title;
      this.listaPaises = data.paises;
    }
    else{
      this.title = data.title;
      this.listaPaises = data.paises;
    }


    this.formGroup = this.formBuilder.group({
      nombre: ['',[Validators.required]],
      pais: ['',[Validators.required]]
    })
  }

  save(){
    if (this.formGroup.value.pais){
      let _edit: Ciudad = {id: this.datos.id, nombre: this.datos.nombre, idPais: this.datos.idPais, nombrePais: this.datos.nombrePais};
      if (this.datos.id > 0){
        this.servicioCiudad.actualizar(_edit).subscribe(
          result => 
          {
            this.refDialog.close(this.formGroup.value);                   
            this.dialogoConfirmacion.open(DialogComponent, {
              width: '400px', data: {
                titulo: "Confirmación",
                mensaje: "Ciudad actualizada con éxito",
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
        this.servicioCiudad.nuevo(_edit).subscribe(
          result =>
          {
            this.refDialog.close(this.formGroup.value);
            this.dialogoConfirmacion.open(DialogComponent, {
              data: {
                titulo: "Confirmación",
                mensaje: "Ciudad ingresada con éxito",
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
    else{
      this.dialogoConfirmacion.open(DialogComponent, {
        data: {
          titulo: "Advertencia",
          mensaje: "Debe ingresar un nombre y seleccionar un país",
          icono: "warning",
          clase: "class-warning"
        }
      })
      this.spinnerService.hide();
    }
    
  }
}
