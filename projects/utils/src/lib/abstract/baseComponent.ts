import { Component, OnDestroy } from '@angular/core';

import { TaAbstractComponent } from './abstractComponent';

@Component({ template: '' })
export abstract class TaBaseComponent extends TaAbstractComponent implements OnDestroy {
  constructor() {
    super();
  }

  public trackById(_: any, item: { id: number | string }) {
    return item.id;
  }

  public trackByKey(_: any, item: { key: string }) {
    return item.key;
  }
}
