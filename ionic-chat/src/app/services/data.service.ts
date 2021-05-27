import { Forbidden } from './../models/exceptions';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BadInput, NotFoundError, Conflict, AppError } from '../models/exceptions';
//Clase base de cada servicio HTTP
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //Obtenemos la url desde environment
  url = environment.base_url

  constructor(protected http: HttpClient) { }

  //Tiramos un error diferente dependiendo del tipo de estado
  protected handleError(error: Response) {
    if (error.status === 400)
      return throwError(new BadInput(error));

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 409)
      return throwError(new Conflict(error));

    if (error.status === 403)
      return throwError(new Forbidden(error))

    return throwError(new AppError(error));
  }
}
