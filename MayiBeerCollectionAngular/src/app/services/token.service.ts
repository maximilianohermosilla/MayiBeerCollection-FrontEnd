import { Injectable } from '@angular/core';

const TOKEN_KEY = "AuthToken";
const USERNAME_KEY = "AuthUserName";
const AUTHORITIES_KEY = "AuthAuthorities";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  perfil: string = "";

  constructor() { }

  public setToken(token: string): void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public setUserName(userName: string): void{
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public setAuthorities(authorities: string): void{
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getToken(): string | null{
    //console.log(sessionStorage.getItem(TOKEN_KEY));
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getUserName(): string{
    return sessionStorage.getItem(USERNAME_KEY)!;
  }

  /*public getAuthoritiesMultiple(): string[]{
    this.perfiles = [];
    if (sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach( (authority: { authority: string; }) => {
        this.perfiles.push(authority.authority);
      });
    }
    return this.perfiles;    
  }  */
  
  public getAuthorities(): string{
    this.perfil = "";
    //console.log(sessionStorage.getItem(AUTHORITIES_KEY));
    if (sessionStorage.getItem(AUTHORITIES_KEY) != undefined)
    {      
      this.perfil = JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!)
    }    
    return this.perfil;    
  }    

    public logOut(): void {
      window.sessionStorage.clear();
    }
}
