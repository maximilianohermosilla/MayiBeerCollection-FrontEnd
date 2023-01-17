export class Usuario {
    Login: string;
    Password: string;

    constructor(user: string, password: string) {
        this.Login = user;
        this.Password = password;
    }

}