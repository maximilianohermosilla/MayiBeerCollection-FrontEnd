import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Busqueda } from '../models/busqueda';
import { Cerveza } from '../models/cerveza';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CervezaService {
  apiUrl = enviroment.urlBase() + "Cerveza/";
  spinner = new BehaviorSubject<Boolean>(true);

  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "buscar/" + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listar");    
  }
  
    public GetAllProxy(): Observable<any> {
      return this.http.get<any[]>(this.apiUrl + "listarProxy");    
    }

  public GetAllMarcas(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarMarcas");    
  }

  public GetAllEstilos(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarEstilos");    
  }

  public GetAllCiudades(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarCiudades");    
  }

  public GetAllPaises(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarPaises");    
  }

  public GetCantidades(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarCantidades");    
  }

  public GetBusqueda(busqueda: Busqueda): Observable<any> {
    return this.http.post<any[]>(this.apiUrl + "busquedaFiltros", busqueda);    
  }
  
  public nuevo(cerveza: Cerveza): Observable<any> {
    return this.http.post<Cerveza>(this.apiUrl + "nuevo", cerveza);
  }

  public actualizar(cerveza: Cerveza): Observable<Cerveza>{
    return this.http.put<Cerveza>(this.apiUrl + "actualizar", cerveza);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  } 
}
