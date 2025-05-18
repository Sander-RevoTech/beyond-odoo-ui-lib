import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { map } from 'rxjs/operators';

import { BydRoutes } from '@beyond/menu';
import { BydPermissionsServices } from '@beyond/server';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly _permissionsServices = inject(BydPermissionsServices);

  constructor(private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this._permissionsServices.isAuthenticated === false) {
      this.setRedirect();
      return false;
    }
    return this._permissionsServices.isAuthenticated;
  }

  public setRedirect(): void {
    this.router.navigateByUrl(BydRoutes.getLogin());
  }
}
