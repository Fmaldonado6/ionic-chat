import { UsersService } from 'src/app/services/users/users.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private usersService: UsersService) { }


  intercept(req, next) {
    let token = req;
    const savedToken = this.usersService.getToken()
    if (savedToken) {
      token = req.clone({
        setHeaders: {
          Authorization: `Bearer ${savedToken}`
        }
      })
    }

    return next.handle(token)

  }
}
