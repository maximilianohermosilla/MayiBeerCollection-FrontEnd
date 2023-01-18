import { ChangeDetectorRef, Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Navitem } from './models/navitem';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { TokenService } from './services/token.service';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from './services/spinner.service';
import { DialogComponent } from './components/shared/dialog/dialog.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MayiBeerCollectionAngular';
  showFiller = false;
  isAdmin: boolean = false;
  mobileQuery: MediaQueryList;
  fillerNav: Navitem[] = [];
  navitem: Navitem = { nombre: "", routerlink: "", icon: "" };
  //fillerNav = Array.from({length: 6}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;
  userName: string = "";
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private tokenService: TokenService
    , public spinnerService: SpinnerService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void{    
    this.isAdmin  = (this.tokenService.getToken())? true: false;
    this.fillerNav.push({nombre: "Inicio",routerlink: "menu",icon: "home"}); 
    if (this.isAdmin) {
      this.userName = this.tokenService.getUserName();
      this.fillerNav.push({nombre: "Cervezas",routerlink: "cervezas",icon: "sports_bar"}); 
      this.fillerNav.push({nombre: "Marcas",routerlink: "marcas",icon: "local_mall"}); 
      this.fillerNav.push({nombre: "Estilos",routerlink: "estilos",icon: "soup_kitchen"}); 
      this.fillerNav.push({nombre: "Paises",routerlink: "paises",icon: "public"}); 
      this.fillerNav.push({nombre: "Ciudades",routerlink: "ciudades",icon: "location_city"});       
    }
    this.fillerNav.push({nombre: "Búsquedas",routerlink: "dashboard",icon: "search"}); 
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  login(){
    this.spinnerService.show();
    const dialogRef = this.dialog.open(LoginComponent,{
      width: '640px',disableClose: false, data: {
        title: "Ingresar",        
      } 
    });
    dialogRef.afterClosed().subscribe( res => {
      setTimeout(() => {
        window.location.reload();            
        this.spinnerService.hide();
      }, 1000);
    })   
  }

  toggleLogin(){ 
    if(this.tokenService.getToken()){
      this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea cerrar la sesión?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.spinnerService.show();
          this.userName = "";
          this.router.navigate(['menu']);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "Cierre de sesión exitoso",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.spinnerService.show();
          this.tokenService.logOut();          
          setTimeout(() => {
            window.location.reload();            
          }, 1000);
        }
      });      
    }
    else{
      this.spinnerService.hide();
      this.login();
    }    
  }
}