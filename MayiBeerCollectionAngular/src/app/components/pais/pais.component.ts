import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import {MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from 'src/app/models/pais';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private servicioPais: PaisService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<PaisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pais: any, title: string }) {
    
    this.title = "Nuevo pais";

    if (data.pais != undefined) {
      this.datos = data.pais;
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
    if (this.datos.id > 0){
      console.log("update");
      let _editPais: Pais = {id: this.datos.id, nombre: this.datos.nombre};
      console.log(_editPais);
      this.servicioPais.actualizar(_editPais).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
    else{      
      console.log("nuevo");
      this.servicioPais.nuevo(this.datos).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
  }
}
