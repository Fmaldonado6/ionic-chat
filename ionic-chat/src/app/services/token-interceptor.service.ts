import { DatabaseService } from './database/database.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private databaseService:DatabaseService) { }


  intercept(req, next) {
    let token = req;
    const savedToken = this.databaseService.token
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
