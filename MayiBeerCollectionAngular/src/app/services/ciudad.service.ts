import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { Ciudad } from '../models/ciudad';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  apiUrl = enviroment.urlBase() + "Ciudad/";
  
  constructor(private http: HttpClient, private dialogoConfirmacion: MatDialog) { }

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

  public eliminarById(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id)
    .pipe(
      catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error}`;
          } else {
              errorMsg = this.getServerErrorMessage(error);
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: errorMsg,
              icono: "warning",
              clase: "class-error"
            }
          })
          return errorMsg;
      })
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {    
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.error}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            //return `Unknown Server Error: ${error.error}`;
            return `${error.error}`;
        }

    }
  }
}

