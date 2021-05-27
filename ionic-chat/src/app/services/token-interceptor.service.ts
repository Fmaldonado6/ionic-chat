import { DatabaseService } from './database/database.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private databaseService: DatabaseService) { }

  //Se utiliza para mandar el token en cada petición
  intercept(req, next) {
    let token = req;
    //Obtenemos el token
    const savedToken = this.databaseService.token
    //Si el token no es null lo agregamos al request
    if (savedToken) {
      token = req.clone({
        setHeaders: {
          Authorization: `Bearer ${savedToken}`
        }
      })
    }
    //Continuamos con la petición
    return next.handle(token)

  }
}
