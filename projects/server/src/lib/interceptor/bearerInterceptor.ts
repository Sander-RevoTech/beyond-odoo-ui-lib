import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { BydPermissionsServices } from '../services/user/permissions.services.';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  private readonly _permissionsServices = inject(BydPermissionsServices);

  constructor() {
    console.log('BearerInterceptor');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._permissionsServices.token) {
      const bearerHeader = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this._permissionsServices.token),
      });
      return next.handle(bearerHeader);
    }

    return next.handle(req);
  }
}
