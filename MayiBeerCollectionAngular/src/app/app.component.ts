import { ChangeDetectorRef, Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Navitem } from './models/navitem';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MayiBeerCollectionAngular';
  showFiller = false;
  mobileQuery: MediaQueryList;
  fillerNav: Navitem[] = [];
  //fillerNav = Array.from({length: 6}, (_, i) => `Nav Item ${i + 1}`);
  navitem: Navitem = { nombre: "", routerlink: "", icon: "" };

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void{    
    this.fillerNav.push({nombre: "Inicio",routerlink: "menu",icon: "home"}); 
    this.fillerNav.push({nombre: "Cervezas",routerlink: "cervezas",icon: "sports_bar"}); 
    this.fillerNav.push({nombre: "Marcas",routerlink: "marcas",icon: "local_mall"}); 
    this.fillerNav.push({nombre: "Estilos",routerlink: "estilos",icon: "soup_kitchen"}); 
    this.fillerNav.push({nombre: "Paises",routerlink: "paises",icon: "public"}); 
    this.fillerNav.push({nombre: "Ciudades",routerlink: "ciudades",icon: "location_city"}); 
    this.fillerNav.push({nombre: "Búsquedas",routerlink: "dashboard",icon: "search"}); 
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  login(){
    console.log("login");
  }
}