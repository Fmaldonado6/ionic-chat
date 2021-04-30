import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BadInput, NotFoundError, Conflict, AppError } from '../models/exceptions';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  url = environment.base_url

  constructor(protected http: HttpClient) { }

  protected handleError(error: Response) {
    if (error.status === 400)
      return throwError(new BadInput(error));

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 409)
      return throwError(new Conflict(error));

    return throwError(new AppError(error));
  }
}
