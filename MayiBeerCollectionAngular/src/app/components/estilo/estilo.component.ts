import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Estilo } from 'src/app/models/estilo';
import { EstiloService } from 'src/app/services/estilo.service';

@Component({
  selector: 'app-estilo',
  templateUrl: './estilo.component.html',
  styleUrls: ['./estilo.component.css']
})
export class EstiloComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  datos: Estilo = {id: 0, nombre: ""};
  title = "";
  constructor(private servicioEstilo: EstiloService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<EstiloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { estilo: any; title: string; }) {
    
    this.title = "Nueva Marca";

    if (data.estilo != undefined) {
      console.log(data.estilo);
      this.datos = data.estilo;
      this.title = data.title;
    }

    this.formGroup = this.formBuilder.group({
      nombre: ['',[Validators.required]],
    })
  }
  
  ngOnInit(): void {
    
  }

  ver(element: any) {
    console.log(element);
  }

  save(){
    console.log(this.datos);
    console.log(this.datos.id);
    if (this.datos.id > 0){
      console.log("update");
      let _edit: Estilo = {id: this.datos.id, nombre: this.datos.nombre};
      console.log(_edit);
      this.servicioEstilo.actualizar(_edit).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
    else{      
      console.log("nuevo");
      this.servicioEstilo.nuevo(this.datos).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
  }

}
