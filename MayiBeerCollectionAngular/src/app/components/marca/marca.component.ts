import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
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
  
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";

  constructor(private servicioMarca: MarcaService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<MarcaComponent>, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { marca: any; title: string; }) {
    
    this.title = "Nueva Marca";

    if (data.marca != undefined) {
      this.datos = data.marca;
      this.title = data.title;     
      this.data.marca.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.marca.imagen;
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
    console.log(this.datos);
    console.log(this.datos.id);
    if (this.datos.id > 0){
      console.log("update");
      let _edit: Marca = {id: this.datos.id, nombre: this.datos.nombre,
        imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity};
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
}