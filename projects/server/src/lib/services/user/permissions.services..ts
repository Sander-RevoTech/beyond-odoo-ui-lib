import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable, filter, of } from 'rxjs';

import { Logger } from '../logger';

export type BydPermissionLevel = 'all' | 'read' | 'authenticated' | 'unauthenticated';

type Role = 'admin' | 'interne' | 'shared';
@Injectable({
  providedIn: 'root',
})
export class BydPermissionsServices {
  private _updated$ = new BehaviorSubject<number | null>(null);

  public uid: number | null = null;
  public pass: string | null = null;

  public token: string | null = null;
  public guards: { [index: string]: string[] } = {};
  public roles: Role[] = [];

  get isAuthenticated() {
    return !!this.uid;
  }

  public updated$ = this._updated$.pipe(filter(data => !!data));

  private _sep = '##--##';

  get received() {
    return this._updated$.value !== null;
  }

  constructor() {
    if (sessionStorage.getItem('token')) {
      const token = (<string>sessionStorage.getItem('token')).split(this._sep);
      this.uid = Number(token[0]);
      this.pass = token[1];

      this._updated$.next(Date.now());
    }
  }

  public set(uid: number | null, pass: string) {
    Logger.LogInfo('[PERMISSIONS] user Uid:', uid);

    this.uid = uid;
    this.pass = pass;
    sessionStorage.setItem('token', [this.uid, this.pass].join(this._sep));

    this.guards = {};

    this._updated$.next(Date.now());
  }

  public setRoles(role: Role) {
    this.roles = [role];

    if(role === 'admin') {
      this.guards = {
        all: ['all'],
        admin: ['all'],
        interne: ['all'],
        shared: ['all'],
      };
    } else if(role === 'interne') {
      this.guards = {
        all: ['all'],
        interne: ['all'],
        shared: ['all'],
      };
    }  else if(role === 'shared') {
      this.guards = {
        all: ['read'],
        shared: ['all'],
      };
    }

  }

  public reset() {
    this.uid = null;
    sessionStorage.removeItem('token');

    this.guards = {};

    this._updated$.next(Date.now());
  }

  public hasRole(role: Role): boolean {
    return this.roles.some(x => x === role);
  }

  public canDirectAccess(feature: string, level: BydPermissionLevel): boolean {
    if (level === 'unauthenticated') {
      return !this.isAuthenticated;
    }
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

  public canAccess(feature: string, level: BydPermissionLevel): Observable<boolean> {
    if (this.received) return of(this.canDirectAccess(feature, level));

    return this._updated$.pipe(map(() => this.canDirectAccess(feature, level)));
  }
}
