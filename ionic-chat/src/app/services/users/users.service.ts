import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/internal/operators';
import { User } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DataService {

  TOKEN_STRING = "token-chat-app"

  login(user: User) {
    return this.http.post<string>(`${this.url}/users/auth`, user).pipe(catchError(this.handleError))
  }

  register(user: User) {
    return this.http.post<User>(`${this.url}/users`, user).pipe(catchError(this.handleError), map(e => Object.assign(new User(), e)))
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_STRING, token);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_STRING)
  }

  loggedIn() {
    return !!localStorage.getItem(this.TOKEN_STRING);
  }

  signOut() {
    localStorage.removeItem(this.TOKEN_STRING)
  }

  getTokenInfo() {
    let token = this.getToken();
    let base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
