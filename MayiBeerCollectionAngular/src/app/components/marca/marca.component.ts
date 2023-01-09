import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';

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
  datos: Marca = {id: 0, nombre: ""};
  title = "";
  constructor(private servicioMarca: MarcaService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<MarcaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { marca: any; title: string; }) {
    
    this.title = "Nueva Marca";

    if (data.marca != undefined) {
      this.datos = data.marca;
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
      let _edit: Marca = {id: this.datos.id, nombre: this.datos.nombre};
      console.log(_edit);
      this.servicioMarca.actualizar(_edit).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
    else{      
      console.log("nuevo");
      this.servicioMarca.nuevo(this.datos).subscribe(result =>
        {this.refDialog.close(this.formGroup.value);}
      );
    }
  }
}