import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Marca } from 'src/app/models/marca';
import { MarcaService } from 'src/app/services/marca.service';
import { MarcaComponent } from '../marca/marca.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {  
  dataSource: any;    
  datos: Marca = {id: 0, nombre: "", imagen: ""};
  title = "";
  filterText: string = "";
  
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";

  constructor(private servicioMarca: MarcaService, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private sanitizer: DomSanitizer) {
    
   
    //this.data.marca.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.marca.imagen;

  }
  
  ngOnInit(): void {
    this.servicioMarca.GetAll().subscribe((rta: any[]) => {
      this.dataSource = rta;    
      console.log(this.dataSource);
    })
  }

  selectFile(event: Event): void{
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
      this.imageFileSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64)
    }, 1000); 
  }
  
  applyFilter(filterValue: string){
    this.filterText=filterValue;
     //this.cervezas.filter = filterValue.trim().toLowerCase();
   }
}