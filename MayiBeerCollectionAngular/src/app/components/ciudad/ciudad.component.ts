import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Ciudad } from 'src/app/models/ciudad';
import { Pais } from 'src/app/models/pais';
import { CiudadService } from 'src/app/services/ciudad.service';

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

  constructor(private servicioCiudad: CiudadService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<CiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ciudad: any, title: string, paises: any[] }) {
    
    this.title = "Nueva ciudad";
    console.log(data);
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
      if (this.datos.id > 0){
        let _edit: Ciudad = {id: this.datos.id, nombre: this.datos.nombre, idPais: this.datos.idPais, nombrePais: this.datos.nombrePais};
        this.servicioCiudad.actualizar(_edit).subscribe(result =>
          {this.refDialog.close(this.formGroup.value);}
        );
      }
      else{   
        this.servicioCiudad.nuevo(this.datos).subscribe(result =>
          {this.refDialog.close(this.formGroup.value);}
        );
      }
    }
    else{
      console.log("Debe seleccionar un pais");
    }
    
  }
}
