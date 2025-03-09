import { Injectable, OnDestroy, inject } from '@angular/core';

import { getFirstString } from '@beyond/utils';
import { OdooJsonConnector } from './connector/json.service';
import { OdooXmlConnector } from './connector/xml.service';
import { BydBaseService } from '@beyond/server';

@Injectable({
  providedIn: 'root',
})
export abstract class BydBaseOdooService extends BydBaseService implements OnDestroy {
  protected _odooService = inject(OdooXmlConnector);
  protected _odooJsonService = inject(OdooJsonConnector);

  constructor() {
    super();
  }

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
