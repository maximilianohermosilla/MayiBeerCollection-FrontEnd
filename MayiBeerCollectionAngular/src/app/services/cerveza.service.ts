import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cerveza } from '../models/cerveza';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CervezaService {
  apiUrl = enviroment.urlBase() + "Cerveza/";
  
  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }
  
  public nuevo(cerveza: Cerveza): Observable<any> {
    console.log(cerveza);
    return this.http.post<Cerveza>(this.apiUrl + "nuevo", cerveza);
  }

  public actualizar(cerveza: Cerveza): Observable<Cerveza>{
    console.log(cerveza);    
    return this.http.put<Cerveza>(this.apiUrl + "actualizar", cerveza);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  } 
}
