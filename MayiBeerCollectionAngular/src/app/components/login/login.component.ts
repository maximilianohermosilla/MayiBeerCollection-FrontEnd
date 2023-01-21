import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/services/login.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenService } from 'src/app/services/token.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

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

  constructor(private formBuilder: FormBuilder, private authService: LoginService, private route: Router, private tokenService: TokenService, 
    private spinnerService: SpinnerService, public refDialog: MatDialogRef<LoginComponent>, public dialogoConfirmacion: MatDialog){

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
      this.dialogoConfirmacion.open(DialogComponent, {
        width: '400px', data: {
          titulo: "Confirmación",
          mensaje: "Acceso Correcto",
          icono: "check_circle",
          clase: "class-success"
        }
      });
      this.refDialog.close(this.loginUsuario);   
    },
    error => {
      console.log(error);
      if (error.status >= 400){
        error.error = "Usuario o contraseña incorrectas";
      }
      else if (error.status == 0){
        error.error = "No es posible iniciar sesión. Consulte con su administrador";
      }
      else{
        this.isLoginFail = true;
        this.isLogged = false;     
        this.errMsj = error; 
        this.refDialog.close(this.loginUsuario);   
      }
      this.dialogoConfirmacion.open(DialogComponent, {
        data: {
          titulo: "Error",
          mensaje: error.error,
          icono: "warning",
          clase: "class-error"
        }
      })
      this.spinnerService.hide(); 
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
