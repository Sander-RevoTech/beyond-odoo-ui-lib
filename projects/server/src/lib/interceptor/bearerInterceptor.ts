import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Permissions } from '../services/user/permissions.services.';


@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  constructor() {
    console.log("BearerInterceptor")
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(Permissions.token) {
      const bearerHeader = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + Permissions.token)
      });
      return next.handle(bearerHeader);
    }

    return next.handle(req);

  }
}
