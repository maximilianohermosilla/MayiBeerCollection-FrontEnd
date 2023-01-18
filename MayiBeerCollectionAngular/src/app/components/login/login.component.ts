import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/services/login.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();
  formGroup: FormGroup;

  loginUsuario: Usuario = {
    Login: '',
    Password: ''
  };
  
  isLogged: boolean = false;
  isLoginFail = false;
  perfil: string = "";
  errMsj: string = "";

  constructor(private formBuilder: FormBuilder, private authService: LoginService, private route: Router, private tokenService: TokenService, private spinnerService: SpinnerService, public refDialog: MatDialogRef<LoginComponent>){

  this.formGroup = this.formBuilder.group({
    Login: ['',[Validators.required]],
    Password: ['',[Validators.required]]
    })  
  }

  submit() {
    if (this.formGroup.valid) {
      this.submitEM.emit(this.formGroup.value);
    }
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.perfil = this.tokenService.getAuthorities();
    }
  }

  onSubmit(){
    this.btnSubmit.emit();
  }

  get User(){
    return this.formGroup.get('user');
  }

  get Password(){
    return this.formGroup.get('password');
  }

  onLogin(){
    this.authService.iniciarSesion(this.loginUsuario).subscribe(data=>{
      this.isLogged = true;
      this.isLoginFail = false;    
      this.perfil = data.role;
      this.refDialog.close(this.loginUsuario);   
    },
    error => {
      if (error.status >= 400){
        error.error = "Usuario o contraseña incorrectas";
      }
      this.isLoginFail = true;
      this.isLogged = false;     
      this.errMsj = error;
      //console.log("error: ", this.errMsj);      
      this.spinnerService.hide(); 
      this.refDialog.close(this.loginUsuario);    
    }
    )
  }

  loginInvitado(){
    this.loginUsuario.Login = "invitado";
    this.loginUsuario.Password = "CLAve123**";
    this.onLogin();
  }

  loginUser(){
    this.loginUsuario = this.formGroup.value;
    this.onLogin();
  }
}
