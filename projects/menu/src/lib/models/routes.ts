import { ActivatedRouteSnapshot } from '@angular/router';

export enum BydMainRoute {
  HOME = 'HOME',
  USERLOGIN = 'USERLOGIN',
  USERLOGOUT = 'USERLOGOUT',
}
export interface IRoute {
  key: string;
  url: string;
  canActivate?: boolean;
  children?: IRoute[];
}

export class BydRoutesCore {
  public routes: IRoute[] = [
    {
      key: BydMainRoute.HOME,
      url: '',
    },
    {
      key: BydMainRoute.USERLOGIN,
      url: 'login',
    },
    {
      key: BydMainRoute.USERLOGOUT,
      url: 'logout',
    },
  ];

  constructor() {}

  public addRoute(route: IRoute) {
    this.routes.push(route);
  }
  public addRoutes(routes: IRoute[]) {
    routes.forEach(route => this.addRoute(route));
  }
  public getHome() {
    return this.getAbsoluteUrl([BydMainRoute.HOME]);
  }
  public getLogin() {
    return this.getAbsoluteUrl([BydMainRoute.USERLOGIN]);
  }
  public getLogout() {
    return this.getAbsoluteUrl([BydMainRoute.USERLOGOUT]);
  }
  public getUrl(eNums: string[], params: {} = {}, strict = false): string {
    const url = this._replaceParams(this._getUrl(eNums), params);
    return strict ? this._removeParams(url) : url;
  }
  public getAbsoluteUrl<T>(
    eNums: string[],
    params: T = {} as T,
    queryParams: { [index: string]: string } | null = null,
    strict = false
  ): string {
    const url = this._replaceParams(this._getUrl(eNums, true), params);
    return (strict ? this._removeParams(url) : url) + (queryParams ? this._formatQueryParams(queryParams) : '');
  }
  public addQueryParamsToUrl(route: ActivatedRouteSnapshot, params: { [index: string]: any } = {}): string {
    const keys = Object.keys(params);

    for (let key of keys) {
      route.params[key] = params[key];
    }
    return route.toString();
  }
  public getPermission(eNums: any[]): boolean {
    const route = this._getRouteByENum(eNums);
    if (route === null) {
      return true;
    } else {
      return route.canActivate === undefined ? true : route.canActivate;
    }
  }

  private _replaceParams(url: string, params: any): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }
    // Create regex using the keys of the replacement object.
    const regex = new RegExp(':(' + Object.keys(params).join('|') + ')', 'g');
    // Replace the string by the value in object
    return url.replace(regex, (m, $1) => params[$1] || m);
  }
  private _removeParams(url: string): string {
    const regex = new RegExp('/:([a-zA-Z0-9_]*)', 'g');
    return url.replace(regex, '');
  }
  private _getRouteByENum(eNums: any[]): IRoute | null {
    let route: IRoute | null = null;
    for (const eNum of eNums) {
      route = this._getByENum(route === null ? this.routes : route.children, eNum);
      if (route === null) {
        return null;
      }
    }
    return route;
  }

  private _getUrl(eNums: any[], absolute = false): string {
    let route: IRoute | null = null;
    let url = '';
    for (const eNum of eNums) {
      route = this._getByENum(route === null ? this.routes : route.children, eNum);
      if (route === null) {
        break;
      }
      url += (url === '' ? '' : '/') + route.url;
    }
    return route === null ? '' : absolute === false ? route.url : '/' + url;
  }

  private _getByENum(routes: IRoute[] | null | undefined, eNum: string): IRoute | null {
    if (!routes) {
      return null;
    }
    for (const route of routes) {
      if (route.key === eNum) {
        return route;
      }
    }
    return null;
  }

  private _formatQueryParams(params: { [index: string]: string }): string {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return queryString ? `?${queryString}` : '';
  }
}
export const BydRoutes = new BydRoutesCore();
