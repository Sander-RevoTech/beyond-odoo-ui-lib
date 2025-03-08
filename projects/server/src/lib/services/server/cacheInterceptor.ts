import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { differenceInMinutes } from 'date-fns';
import { Observable, of, share, tap } from 'rxjs';

import { Logger } from '../logger';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<string, { timestamp: Date; response: HttpResponse<any> }> = new Map();
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }
    const cacheTime = Number(req.params.get('cacheTime'));

    if (cacheTime === 0) {
      Logger.LogInfo('[SERVER] Api No Cache required', req.url);
      return next.handle(req);
    }
    const cachedResponse = this.cache.get(req.url);

    if (cachedResponse) {
      const diffInMinutes = differenceInMinutes(new Date(), cachedResponse?.timestamp);

      if (cacheTime === -1 || cacheTime > diffInMinutes) {
        Logger.LogInfo('[SERVER] Api Cached response:', req.url, cachedResponse);
        return of(cachedResponse.response.clone());
      } else {
        Logger.LogInfo('[SERVER] Api Cached expired', req.url);
      }
    }

    return next.handle(req).pipe(
      tap((stateEvent: any) => {
        if (stateEvent instanceof HttpResponse) {
          this.cache.set(req.url, {
            timestamp: new Date(),
            response: stateEvent.clone(),
          });
        }
      }),
      share()
    );
  }
}
