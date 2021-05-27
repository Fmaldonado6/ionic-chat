import { Passwords } from './../../models/models';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/internal/operators';
import { User } from 'src/app/models/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DataService {


  //Usuario loggeado
  loggedUser: User
  //Variable para notificar los cambios en el usuario loggeado
  userChanged = new BehaviorSubject<User>(null)
  //Funcion para cambiar el valor de userChanged
  setUser(user: User) {
    this.loggedUser = user
    this.userChanged.next(user)
  }

  //Llamada a la api para login
  login(user: User) {
    return this.http.post<string>(`${this.url}/users/auth`, user).pipe(catchError(this.handleError))
  }
  //Llamada a la api para registrarse
  register(user: User) {
    return this.http.post<User>(`${this.url}/users`, user)
      .pipe(catchError(this.handleError),
        map(e => Object.assign(new User(), e)))
  }

  //Llamada a la api para obtener información del usuario
  getUserInfo(id: string) {
    return this.http.get<User>(`${this.url}/users/${id}`).pipe(catchError(this.handleError))
  }
  //Llamada a la api para obtener usuarios
  getUsers() {
    return this.http.get<User[]>(`${this.url}/users`)
      .pipe(catchError(this.handleError),
        map(e => e.map(x => Object.assign(new User(), x))))
  }
  //Llamada a la api para obtener actualizar usuario
  updateUser(user: User) {
    return this.http.put<User>(`${this.url}/users`, user)
      .pipe(catchError(this.handleError),
        map(e => Object.assign(new User(), e)))
  }

  //Llamada a la api para obtener actualizar la contraseña del usuario
  updateUserPassword(passwords: Passwords) {
    return this.http.put<Passwords>(`${this.url}/users/password`, passwords)
      .pipe(catchError(this.handleError),
        map(e => Object.assign(new Passwords(), e)))
  }

  //Se desencripta el token y regresamos su información, si es null regresamos null
  getTokenInfo(token: string) {

    if (!token)
      return null

    let base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
