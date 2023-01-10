import { Component, Inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';
import { ImageSlide } from 'src/app/models/image-slide';
import { Marca } from 'src/app/models/marca';
import { EstiloService } from 'src/app/services/estilo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { PaisService } from 'src/app/services/pais.service';
import { MarcaComponent } from '../marca/marca.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent { 
  dataSource: Marca[] = [];    
  datos: Marca = {id: 0, nombre: "", imagen: ""};
  title = "";
  filterText: string = "";
  
  base64: string = ''
  fileSelected?: Blob;
  archivo: any;
  imageFileSanitized: any;
  defaultImage = "/assets/img/default.png";  
    
  marcasObject = Array();
  estilosObject = Array();
  paisesObject = Array();

  constructor(private servicioMarca: MarcaService, private servicioEstilos: EstiloService, private servicioPaises: PaisService,
    public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private sanitizer: DomSanitizer) {    
   
    //this.data.marca.imagen == null? this.imageFileSanitized = this.defaultImage: this.imageFileSanitized = this.data.marca.imagen;

  }
  
  ngOnInit(): void {
    this.getMarcas();
    this.getEstilos();
    this.getPaises();

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

   imageClickFxn(event: any){
    console.log(event);
    console.log(this.marcasObject[event].id);
    console.log(this.marcasObject[event].title);
   }

   getMarcas(){
    this.servicioMarca.GetAll().subscribe((rta: any[]) => {
      this.dataSource = rta;    
      this.dataSource.forEach(element => {
        var imageSlide: ImageSlide = {id: 0, image: '', thumbImage: '', alt: '', title: ''} ;
        imageSlide.id = element.id;
        imageSlide.image = element.imagen;
        imageSlide.thumbImage = element.imagen;
        imageSlide.alt = element.nombre;
        imageSlide.title = element.nombre;
        this.marcasObject.push(imageSlide);
      });
    })
   }

   getEstilos(){
    this.servicioEstilos.GetAll().subscribe((rta: any[]) => {
      this.dataSource = rta; 
      console.log(rta);   
      this.dataSource.forEach(element => {
        var imageSlide: ImageSlide = {id: 0, image: '', thumbImage: '', alt: '', title: ''} ;
        imageSlide.id = element.id;
        imageSlide.image = element.imagen;
        imageSlide.thumbImage = element.imagen;
        imageSlide.alt = element.nombre;
        imageSlide.title = element.nombre;
        this.estilosObject.push(imageSlide);
      });
    })
   }

   getPaises(){
    this.servicioPaises.GetAll().subscribe((rta: any[]) => {
      this.dataSource = rta;    
      this.dataSource.forEach(element => {
        var imageSlide: ImageSlide = {id: 0, image: '', thumbImage: '', alt: '', title: ''} ;
        imageSlide.id = element.id;
        imageSlide.image = element.imagen;
        imageSlide.thumbImage = element.imagen;
        imageSlide.alt = element.nombre;
        imageSlide.title = element.nombre;
        this.paisesObject.push(imageSlide);
      });
    })
   }
}