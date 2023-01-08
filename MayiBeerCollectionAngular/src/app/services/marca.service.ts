import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  apiUrl = enviroment.urlBase() + "Marca/";
  
  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }

  
  public nuevo(marca: Marca): Observable<any> {
    console.log(marca);
    return this.http.post<Marca>(this.apiUrl + "nuevo", marca);
  }

  public actualizar(marca: Marca): Observable<Marca>{
    console.log(marca);    
    return this.http.put<Marca>(this.apiUrl + "actualizar", marca);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  }
}
