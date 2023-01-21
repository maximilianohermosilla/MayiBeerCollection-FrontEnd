import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JwtDTO } from '../models/jwt';
import { Usuario } from '../models/usuario';
import { enviroment } from '../shared/enviroment';
import { SpinnerService } from './spinner.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = enviroment.urlBase() + "Usuario/";
  token: any;
  isLogin: boolean = false;
  currentUserSubject: BehaviorSubject<any>;

  jwtHelper = new JwtHelperService();
  decodeToken: any;
  expirationDate: any;
  isExpired: any;

  constructor(private httpClient: HttpClient, private router: Router, private spinnerService: SpinnerService, private tokenService: TokenService) { 
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
  }

  public GetById(id: Number): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl);    
  }  

  iniciarSesion(credenciales: Usuario): Observable<JwtDTO>{
    this.spinnerService.show();
    return this.httpClient.post<any>(this.apiUrl + 'login', credenciales).pipe(map(data=>{   
        this.decodeToken = this.jwtHelper.decodeToken(data.token);
        console.log(data);
        //console.log(this.decodeToken);
        //this.expirationDate = this.jwtHelper.getTokenExpirationDate(data.token);
        //this.isExpired = this.jwtHelper.isTokenExpired(data.token);
        //this.uiService.toggleSession();
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(this.decodeToken.nameid);
        this.tokenService.setAuthorities(this.decodeToken.role);
        sessionStorage.setItem('curentUser', JSON.stringify(this.decodeToken));
        this.currentUserSubject.next(this.decodeToken);
        this.spinnerService.hide();

        return this.decodeToken;
      }))
  }

  get UsuarioAutenticado(){
    //console.log("Usuario aut: ", this.currentUserSubject.value);
    //console.log(this.currentUserSubject);
    return this.currentUserSubject.value;
  }


  logout(){
    //localStorage.removeItem('token');
    this.isLogin = false;
  }

  public get logIn(): boolean {
    //return (localStorage.getItem('token') !== null);
    return this.isLogin;
  }
}
