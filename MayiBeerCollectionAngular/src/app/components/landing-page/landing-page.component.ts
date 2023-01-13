import { Component, Inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ImageSlide } from 'src/app/models/image-slide';
import { Marca } from 'src/app/models/marca';
import { EstiloService } from 'src/app/services/estilo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { PaisService } from 'src/app/services/pais.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
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

  constructor(private servicioMarca: MarcaService, private servicioEstilos: EstiloService, private servicioPaises: PaisService, public spinnerService: SpinnerService,
    public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private sanitizer: DomSanitizer, private router: Router) {  

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

   imageClick(event: any, param: string){
    switch (param) {
      case 'idMarca':
        this.router.navigate(['dashboard'], { queryParams: { idMarca: this.marcasObject[event].id } });    
        break;
      case 'idPais':
        this.router.navigate(['dashboard'], { queryParams: { idPais: this.paisesObject[event].id } });    
        break;
      case 'idEstilo':
        this.router.navigate(['dashboard'], { queryParams: { idEstilo: this.estilosObject[event].id } });    
        break;
      default:
        break;
    }
   }

   getMarcas(){
    this.servicioMarca.GetAll().subscribe((rta: any[]) => {
      this.dataSource = rta;    
      this.marcasObject.push({id: 0, image: '', thumbImage: '', alt: '', title: ''});
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
      this.estilosObject.push({id: 0, image: '', thumbImage: '', alt: '', title: ''});
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
      this.paisesObject.push({id: 0, image: '', thumbImage: '', alt: '', title: ''});
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