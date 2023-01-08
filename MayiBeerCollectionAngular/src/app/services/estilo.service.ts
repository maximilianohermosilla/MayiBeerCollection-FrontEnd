import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estilo } from '../models/estilo';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EstiloService {
  apiUrl = enviroment.urlBase() + "Estilo/";
  
  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }

  public nuevo(estilo: Estilo): Observable<any> {
    console.log(estilo);
    return this.http.post<Estilo>(this.apiUrl + "nuevo", estilo);
  }

  public actualizar(estilo: Estilo): Observable<Estilo>{
    console.log(estilo);    
    return this.http.put<Estilo>(this.apiUrl + "actualizar", estilo);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  }  
}
