import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/internal/operators';
import { User } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DataService {

  login(user: User) {
    return this.http.post<string[]>(`${this.url}/users`, user).pipe(catchError(this.handleError))
  }

  register(user: User) {
    return this.http.post<User>(`${this.url}/users`, user).pipe(catchError(this.handleError), map(e => Object.assign(new User(), e)))
  }

}
