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

  onLogin(event: Event){
    event.preventDefault;
    //console.log(this.formGroup.value);
    this.authService.iniciarSesion(this.formGroup.value).subscribe(data=>{
      console.log(data);
      this.isLogged = true;
      this.isLoginFail = false;    
      this.perfil = data.role;
      this.refDialog.close(this.formGroup.value);    
      //this.route.navigate(['/portfolio']);
    },
    error => {
      this.isLoginFail = true;
      this.isLogged = false;     
      this.errMsj = error;
      //console.log("error: ", this.errMsj);      
      this.spinnerService.hide(); 
      this.refDialog.close(this.formGroup.value);    
    }
    )
  }
}
