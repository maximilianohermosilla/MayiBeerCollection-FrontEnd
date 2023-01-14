import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Pais } from '../models/pais';
import { enviroment } from 'src/app/shared/enviroment';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  apiUrl = enviroment.urlBase() + "Pais/";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);    
  }

  public nuevo(pais: Pais): Observable<any> {
    console.log(pais);
    return this.http.post<Pais>(this.apiUrl + "nuevo", pais);
  }

  public actualizar(pais: Pais): Observable<Pais>{
    console.log(pais);    
    return this.http.put<Pais>(this.apiUrl + "actualizar", pais);
  }

  public eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "eliminar/" + id)
    .pipe(catchError(this.manejoError));;
  }

  private manejoError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.warn('Error:', error.error.error)
    } else {
      console.warn('HTTPStatus:', error.status.toString(), error.error)
    }
    // this.dialogoConfirmacion.open(DialogComponent, {
    //   data: {
    //     titulo: "Error",
    //     mensaje: error.error,
    //     icono: "warning",
    //     clase: "class-error"
    //   }
    // })
    alert(error.error);
    //return error.error;
    return throwError(() => error);
  }
}
