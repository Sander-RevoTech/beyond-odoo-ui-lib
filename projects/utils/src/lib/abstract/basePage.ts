import { Component } from '@angular/core';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

import { distinctUntilChanged, map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { getPropertyTypes } from '../utils/object';
import { TaAbstractComponent } from './abstractComponent';

@Component({ template: '' })
export abstract class TaBasePage extends TaAbstractComponent {
  constructor() {
    super();
  }

  protected _getPathParams<T extends object>(data: T): Observable<T> {
    return this._filterParams(this._route.params, getPropertyTypes(data));
  }

  protected _getQueryParams<T extends object>(data: T): Observable<T> {
    return this._filterParams(this._route.queryParams, getPropertyTypes(data));
  }

  private _filterParams<T>(routeParams: Observable<Params>, paramsAsked: { [K in keyof T]: string }) {
    return routeParams.pipe(
      map(params => convertToParamMap(params)),
      map<ParamMap, T>(params => this._getParamsTyped(paramsAsked, params)),
      distinctUntilChanged()
    );
  }

  private _getParamsTyped(paramsAsked: { [p: string]: string }, params: ParamMap) {
    let paramObject: any = {};

    for (let param in paramsAsked) {
      const value = params.get(param);

      if (value) paramObject[param] = paramsAsked[param] === 'number' ? Number(value) : value;
    }

    return paramObject;
  }
}
