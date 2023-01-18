import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { Marca } from '../models/marca';
import { enviroment } from '../shared/enviroment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  apiUrl = enviroment.urlBase() + "Marca/";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "buscar/" + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listar");    
  }

  public GetAllProxy(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "listarProxy");    
  }
  
  public nuevo(marca: Marca): Observable<any> {
    return this.http.post<Marca>(this.apiUrl + "nuevo", marca);
  }

  public actualizar(marca: Marca): Observable<Marca>{
    return this.http.put<Marca>(this.apiUrl + "actualizar", marca);
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
