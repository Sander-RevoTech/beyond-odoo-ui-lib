import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { BydRoutes } from '@beyond/menu';
import { BydPermissionsServices } from '@beyond/server';


@Injectable({
  providedIn: 'root',
})
export class FeatureGuard {
  private readonly _permissionsServices = inject(BydPermissionsServices);
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const level = route.data['level'];
    const feature = route.data['feature'];

    if (this._permissionsServices.received === true) {
      return this._isValidPermission(feature, level);
    }
    return this._permissionsServices.updated$.pipe(
      map(() => {
        return this._isValidPermission(feature, level);
      })
    );
  }

  public setRedirect(): void {
    this.router.navigateByUrl(BydRoutes.getHome());
  }

  private _isValidPermission(feature: string, level: string) {
    if (this._permissionsServices.canDirectAccess(feature, level)) {
      return true;
    }
    this.setRedirect();
    return false;
  }
}
