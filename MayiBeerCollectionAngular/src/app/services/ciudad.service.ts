import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ciudad } from '../models/ciudad';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  apiUrl = enviroment.urlBase() + "Ciudad/";
  
  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }

  public GetByPaisId(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "buscarPais/" + id);
  }
  
  public nuevo(ciudad: Ciudad): Observable<any> {
    console.log(ciudad);
    return this.http.post<Ciudad>(this.apiUrl + "nuevo", ciudad);
  }

  public actualizar(ciudad: Ciudad): Observable<Ciudad>{
    console.log(ciudad);    
    return this.http.put<Ciudad>(this.apiUrl + "actualizar", ciudad);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  }
}

