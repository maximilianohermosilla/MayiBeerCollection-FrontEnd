import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptorService implements HttpInterceptor{

  constructor(private spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
   this.spinnerService.show();
   return next.handle(req).pipe(
     finalize(()=> this.spinnerService.hide())
   );
  }

}

//export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useclass: InterceptorService, multi: true }];