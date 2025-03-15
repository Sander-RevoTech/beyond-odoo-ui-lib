import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ODOO_SERVER_CONFIG_KEY } from '../injectionToken';


@Injectable()
export class TargetUrlInterceptor implements HttpInterceptor {

  readonly server = inject(ODOO_SERVER_CONFIG_KEY);

  constructor() {  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req.clone({
      headers: req.headers.set('target-url', this.server.odooUrl)
    }));

  }
}
