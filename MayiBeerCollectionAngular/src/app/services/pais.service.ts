import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pais } from '../models/pais';
import { enviroment } from 'src/app/shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  apiUrl = enviroment.urlBase() + "Pais/";
  
  constructor(private http: HttpClient) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }
}
