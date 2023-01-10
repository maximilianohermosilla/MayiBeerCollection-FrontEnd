import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
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

  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";

  constructor(private servicioEstilo: EstiloService, private formBuilder: FormBuilder, public refDialog: MatDialogRef<EstiloComponent>, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: { estilo: any; title: string; }) {
    
    this.title = "Nueva Marca";

    if (data.estilo != undefined) {
      this.datos = data.estilo;
      this.title = data.title;      
      this.data.estilo.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.estilo.imagen;
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
      let _edit: Estilo = {id: this.datos.id, nombre: this.datos.nombre, 
        imagen: this.imageFileSanitized.changingThisBreaksApplicationSecurity};
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
