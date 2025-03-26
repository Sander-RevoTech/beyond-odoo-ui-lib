import { Injectable, inject } from '@angular/core';

import { getFirstString } from '@beyond/utils';

import { OdooJsonConnector } from './connector/json.service';

@Injectable({
  providedIn: 'root',
})
export abstract class BydBaseOdooService {
  public _odooService = inject(OdooJsonConnector);

  constructor() {}

  protected _handleJoinData<T>(
    entity: T,
    props: Array<{
      from?: keyof T;
      to: keyof T;
    }>
  ): T {
    return props.reduce<T>((entityFilled, prop) => {
      const linkProp = prop.from ? prop.from : prop.to.toString() + '_id';
      const list = (<any>entity)[linkProp] || [];
      entityFilled[prop.to] = <any>getFirstString(list);

      return entityFilled;
    }, entity);
  }
}
