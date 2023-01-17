import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { TokenService } from 'src/app/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private loginService: LoginService, private route: Router, private tokenService: TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currentUser = this.loginService.UsuarioAutenticado;
    if (this.tokenService.getToken() != null){
      return true;
    }
    else{
      this.route.navigate(['/menu']);
      return false;
    }
    
    /*if (currentUser && currentUser.accessToken){
      return true;
    }
    else{
      this.route.navigate(['/login']);
      return false;
    }*/
  }
}
