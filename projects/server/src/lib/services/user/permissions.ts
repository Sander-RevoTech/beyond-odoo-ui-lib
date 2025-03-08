import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable, filter, of } from 'rxjs';
import { Logger } from '../logger';


export class PermissionsCore {
  private _updated$ = new BehaviorSubject<number | null>(null);

  public token: string | null = null;
  public guards: { [index: string]: string[] } = {};
  public roles: string[] = [];
  public isAuthenticated: boolean = false;

  public updated$ = this._updated$.pipe(filter(data => !!data));

  get received() {
    return this._updated$.value !== null;
  }

  constructor() {}

  public set(permissions: { permission_name: string }[], roles: string[], isAuthenticated: boolean) {
    Logger.LogInfo('[PERMISSIONS] List brut:', permissions);

    this.guards = {};

    if (permissions) {
      for (let perm of permissions) {
        const access = perm.permission_name.split(':');

        if (!this.guards[access[1]]) {
          this.guards[access[1]] = [];
        }
        this.guards[access[1]].push(access[0]);
      }
    }

    this.roles = roles || [];

    this.setAuthenticated(isAuthenticated);

    this._updated$.next(Date.now());
    Logger.LogInfo('[PERMISSIONS] List:', this.guards, this.roles);
  }

  public setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
    this._updated$.next(Date.now());
  }

  public hasRole(role: string): boolean {
    return this.roles.some(x => x === role);
  }

  public canDirectAccess(feature: string, level: string | 'authenticated'): boolean {
    if (level === 'authenticated') {
      return this.isAuthenticated;
    }

    if (!feature) {
      return true;
    }

    const featureGuard = this.guards[feature];
    if (!featureGuard) {
      return false;
    }

    if (featureGuard.includes('all')) {
      return true;
    }

    if (!featureGuard.includes(level)) {
      return false;
    }

    return true;
  }

  public canAccess(feature: string, level: string | 'authenticated'): Observable<boolean> {
    if (this.received) return of(this.canDirectAccess(feature, level));

    return this._updated$.pipe(map(() => this.canDirectAccess(feature, level)));
  }
}

export const Permissions = new PermissionsCore();
